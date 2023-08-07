import React, { FC, useEffect, useState } from 'react'
import { IUser } from '../../../interfaces/IUser'
import scss from './MultiPlayerBoardComponent.module.scss'
import { Cell } from '../../../chess-logic/models/Cell'
import CellComponent from '../CellComponent/CellComponent'
import useSound from 'use-sound'
import turnTickAudio from '../../../assets/makeTurn.mp3'
import { Colors } from '../../../chess-logic/models/Colors'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import { King } from '../../../chess-logic/figures/King'
import { Rook } from '../../../chess-logic/figures/Rook'
import { Figure } from '../../../chess-logic/models/Figure'
import { SocketMethods } from '../../../interfaces/ws_interfaces'
import { boardSlice } from '../../../redux/reducers/boardRedurcer'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { AvailableWindows, modalSlice } from '../../../redux/reducers/modalReducer'
import ModalWindow, { GameStatusWindow } from '../../ReactComponents/ModalWindow/ModalWindow'
import BarToDisplayTakenFigures from '../BarToDisplayTakenFigures/BarToDisplayTakenFigures'
import TimeTransformation from '../../ReactComponents/TimeTransformation/TimeTransformation'
import { Board } from '../../../chess-logic/models/Board'
import { webSocketSlice } from '../../../redux/reducers/webSocketReducer'

export interface ITimer{
  time : number,
  intervalId : ReturnType<typeof setInterval> | null
}

const MultiPlayerBoardComponent = () => {
  const {ws,gameData} = useAppSelector(state => state.webSocket)
  const {board,currentMove,whiteTakenFigures,blackTakenFigures} = useAppSelector(state => state.board)
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const [makeTurnSound] = useSound(turnTickAudio)
  const [deepCopiedBoard,setDeepCopiedBoard] = useState<Board>(new Board())
  const {endGame,activateTimer,deactivateTimer,setIntervalIdForTimer} = webSocketSlice.actions
  const {updateBoard,changeCurrentMove,addBlackTakenFigure,addWhiteTakenFigure,highlightCells} = boardSlice.actions
  const dispatch = useAppDispatch()
  const showGameStatus = modalSlice.actions.showGameStatus
  const {showModal,showWindow} = useAppSelector(state => state.modal)

  // Change active timer to other's,clean intervals
  const handleTimers = (operation : "CHANGE" | "DEACTIVATE" | "INIT") => {
    if (gameData && gameData.gameActive) {
      if (operation === "CHANGE") {
        if (gameData.clientTimer.intervalId) {
          dispatch(deactivateTimer({
            ...gameData.clientTimer,
            timerType : 'client'
          }))
          // set interval that will decrement time for other timer
          dispatch(setIntervalIdForTimer({
            timerType : 'enemyClient',
            intervalId : setInterval(() => {
              dispatch(activateTimer({
                timerType : 'enemyClient',
                ...gameData.enemyClientTimer
              }))
            },1000)
          }))
        } else {
          if (gameData.enemyClientTimer.intervalId) {
            dispatch(deactivateTimer({
              ...gameData.enemyClientTimer,
              timerType : 'enemyClient'
            }))
            // set interval that will decrement time for other timer
        dispatch(setIntervalIdForTimer({
          timerType : 'client',
          intervalId : setInterval(() => {
            dispatch(activateTimer({
              timerType : 'client',
              ...gameData.clientTimer
            }))
          },1000)
        }))
          }
        }
      }
      if (operation === "DEACTIVATE") {
        dispatch(deactivateTimer({
          ...gameData.clientTimer,
          timerType : 'client'
        }))
        dispatch(deactivateTimer({
          ...gameData.enemyClientTimer,
          timerType : 'enemyClient'
        }))
      }
      if (operation === "INIT"){
        if (gameData.userColor === Colors.WHITE) {
          dispatch(setIntervalIdForTimer({
            timerType : 'client',
            intervalId : setInterval(() => {
              dispatch(activateTimer({
                timerType : 'client',
                ...gameData.clientTimer
              }))
            },1000)
          }))
        } else {
          dispatch(setIntervalIdForTimer({
            timerType : 'enemyClient',
            intervalId : setInterval(() => {
              dispatch(activateTimer({
                timerType : 'enemyClient',
                ...gameData.enemyClientTimer
              }))
            },1000)
          }))
        }
      }
    }
  }

   // check for mate or tie
  const checkForGameStatus = () => {
    if (board && board.cells.length && gameData && gameData.gameActive) {
      // make new deep copy board for finding available turns,if 0,then mate or tie
      setDeepCopiedBoard(board)
      if (ws && deepCopiedBoard.cells.length && deepCopiedBoard.isMate(currentMove)) {
        dispatch(showGameStatus())
        setSelectedCell(null)
        ws.send(JSON.stringify({
          "method":SocketMethods.endGame,
          "winnerColor":gameData.userColor,
        }))
        dispatch(endGame(currentMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE))
      } else {
        if (ws && gameData && gameData.gameActive && deepCopiedBoard.cells.length && deepCopiedBoard.isTie(currentMove)){
          dispatch(showGameStatus())
          ws.send(JSON.stringify({
            "method":SocketMethods.endGame,
            "winnerColor":gameData.userColor,
          }))
          setSelectedCell(null)
          dispatch(endGame(null))
        }
      }
    }
  }
  const updateBoardUi = () => {
    if (board && board.cells.length) {
      if (selectedCell && selectedCell.figure && currentMove !== selectedCell.figure.color){
        // if not your your turn and you selected your piece - clear all available moves 
        board.clearAvailablePropertyInCells()
        return;
      } else {
        // for re-rendering
        updateBoardAction()
        highlightCellsAction()
      }
    };
  }

  const cellOnClick = (targetCell : Cell) => {
    if (gameData && gameData.gameActive) {
       // make turn,works if you already selected a cell and the move can be played
      if (selectedCell && (selectedCell.figure?.color !== targetCell.figure?.color || (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && targetCell.figure.color === selectedCell.figure.color))){
        if (gameData.userColor === currentMove) {
          if (ws && board && board.cells) {
            let takenFigureThisMove : null | Figure = null
            if (selectedCell.figure?.canMove(selectedCell,targetCell,board) && deepCopiedBoard &&  !deepCopiedBoard.kingWillBeUnderAttack(selectedCell,targetCell)) {
              if (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && selectedCell.figure.color === targetCell.figure.color) {
                // SWAP RULE
                selectedCell.figure.moveFigure(selectedCell,targetCell,board,true)
              } else {
                if (targetCell.figure) {
                  const figureInTargetCell = targetCell.figure as Figure
                  takenFigureThisMove = figureInTargetCell
                  if (figureInTargetCell.color === Colors.WHITE) {
                    dispatch(addWhiteTakenFigure(figureInTargetCell))
                  } else {
                    dispatch(addBlackTakenFigure(figureInTargetCell))
                  }   
                }
                selectedCell.figure.moveFigure(selectedCell,targetCell,board)
              }
              ws.send(JSON.stringify({
                "method" : SocketMethods.makeMove,
                "updatedBoardCells" : board.getCellsPropertiesWithoutImg(),
                "wasMove" : currentMove,
                "lobbyId" : gameData.lobbyId,
                "clientTime":gameData.clientTimer.time,
                "enemyClientTime":gameData.enemyClientTimer.time,
                "takenFigureThisMove" : takenFigureThisMove ? {
                  id : takenFigureThisMove.id,
                  color : takenFigureThisMove.color,
                  name : takenFigureThisMove.name,
                } : null,
              }))
              makeTurnSound()
              dispatch(changeCurrentMove(currentMove === Colors.BLACK ? Colors.WHITE : Colors.BLACK))
              checkForGameStatus()
              handleTimers("CHANGE")
              setSelectedCell(null)
              updateBoardUi()
            }
          }
        }
    } else {
      // change active selected cell,if it is your piece
      if (targetCell.figure && targetCell.figure.color === gameData.userColor) {
        setSelectedCell(targetCell)
      }
      }
    }

  }

  const updateBoardAction = () => {
    if (board) {
      const newBoard = board.getCopyBoard()
      // for re-rendering
      dispatch(updateBoard(newBoard))
    }
  }



  const highlightCellsAction = () => {
    if (selectedCell && board && board.cells.length) {
      dispatch(highlightCells(selectedCell))
    }
  }







    

  useEffect(() => {
    // init timers
    if (gameData && gameData.gameActive) {
      handleTimers("INIT")
      // update(set) board
      updateBoardUi()
    } 

    return () => {
      handleTimers("DEACTIVATE")
      console.log("both timers were deactivated!")
    }
  },[gameData?.gameActive])

  useEffect(() => {
    // UseEffect,for checking game ending by time
    if (gameData) {
      if (gameData && gameData.clientTimer.time <= 0 && ws) {
        ws.send(JSON.stringify({
          "method":SocketMethods.endGame,
          "winnerColor" : gameData.userColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK
        }))
        handleTimers("DEACTIVATE")
        dispatch(endGame(gameData.userColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK))
        dispatch(showGameStatus())
      }
      if (gameData && gameData.enemyClientTimer.time <= 0 && ws) {
        // TODO : clean timers
        ws.send(JSON.stringify({
          "method":SocketMethods.endGame,
          "winnerColor":gameData.userColor,
        }))
        handleTimers("DEACTIVATE")
        dispatch(endGame(gameData.userColor))
        dispatch(showGameStatus())
      }


    }

  },[gameData?.clientTimer.time,gameData?.enemyClientTimer.time])


  return (
    <div className={scss.container}>
        {gameData?.userColor === Colors.BLACK && (
          <BarToDisplayTakenFigures color={Colors.BLACK} takenFigures={blackTakenFigures}/>
        )}
         {gameData?.userColor === Colors.WHITE && (
          <BarToDisplayTakenFigures color={Colors.WHITE} takenFigures={whiteTakenFigures}/>
        )}
        {showModal && showWindow === AvailableWindows.GameStatus && gameData && !gameData.gameActive && (
            <ModalWindow children={<GameStatusWindow isWinner={gameData.winner}/>}/>
        )}
        {gameData && (
          <TimeTransformation time={gameData.enemyClientTimer.time}/>
        )}
        <div className={scss.board}>
          <>
            {gameData?.userColor === Colors.BLACK
            ? (
              <>
              {board?.cells.slice().reverse().map((cellRow:Cell[],index) => {
                return (
                  <React.Fragment key={index+"reversed-desk"}>
                    {cellRow.map((cell) => {
                      return (
                        <CellComponent
                          onClick={cellOnClick} 
                          cell={cell}
                          selectedCell={selectedCell}
                          key={cell.id+"reversed-desk"}
                        />
                      )
                    })}           
                  </React.Fragment>
                )
                })}
              </>
            )
            : (
              <>
                {board?.cells.map((cellRow:Cell[],index) => {
                return (
                  <React.Fragment key={index+"not-reversed-desk"}>
                    {cellRow.map((cell) => {
                      return (
                        <CellComponent
                          onClick={cellOnClick} 
                          cell={cell}
                          selectedCell={selectedCell}
                          key={cell.id+"not-reversed-desk"}
                        />
                      )
                    })}           
                  </React.Fragment>
                )
                })}
              </>
            )}
          </>
      </div>
      {gameData && (
          <TimeTransformation time={gameData.clientTimer.time}/>
        )}
      {gameData?.userColor === Colors.BLACK && (
          <BarToDisplayTakenFigures color={Colors.WHITE} takenFigures={whiteTakenFigures}/>
      )}
      {gameData?.userColor === Colors.WHITE && (
        <BarToDisplayTakenFigures color={Colors.BLACK} takenFigures={blackTakenFigures}/>
      )}
    </div>
  )
}

export default MultiPlayerBoardComponent