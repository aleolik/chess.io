import React, { FC, useEffect, useRef, useState } from 'react'
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
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { AvailableWindows, modalSlice } from '../../../redux/reducers/modalReducer'
import ModalWindow, { GameStatusWindow } from '../../ReactComponents/ModalWindow/ModalWindow'
import BarToDisplayTakenFigures from '../BarToDisplayTakenFigures/BarToDisplayTakenFigures'
import TimeTransformation from '../../ReactComponents/TimeTransformation/TimeTransformation'
import { Board } from '../../../chess-logic/models/Board'
import { webSocketSlice } from '../../../redux/reducers/webSocketReducer'
import { createFigureByProperties } from '../../../utils/createFigureByProperties'
import {DeactivateTimersAsync,ActivateTimerAsync,ChangeTimerAsync} from '../../../redux/AsyncActions/TimerOperationsAsync'

export interface ITimer{
  time : number,
  intervalId : ReturnType<typeof setInterval> | null
}

const MultiPlayerBoardComponent = () => {
  const {ws,gameData} = useAppSelector(state => state.webSocket)
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const [makeTurnSound] = useSound(turnTickAudio)
  const [deepCopiedBoard,setDeepCopiedBoard] = useState<Board>(new Board())
  const {endGame,highlightCells,changeCurrentMove,updateBoardForRender,addTakenFigure,clearGameData} = webSocketSlice.actions
  const dispatch = useAppDispatch()
  const showGameStatus = modalSlice.actions.showGameStatus
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  const user = useAppSelector(state => state.user.user)
  const isMountedRef = useRef(false)

  // Change active timer to other's,clean intervals
  const handleTimers = async(operation : "CHANGE" | "DEACTIVATE" | "INIT") => {
    console.log("current operation",operation)
    console.log("current state",gameData)
    if (gameData) {
      if (operation === "CHANGE") {
        if (gameData.clientTimer.intervalId) {
          await dispatch(ChangeTimerAsync())
        } else {
          if (gameData.enemyClientTimer.intervalId) {
            await dispatch(ChangeTimerAsync())
          }
        }
      }
      if (operation === "DEACTIVATE") {
       await dispatch(DeactivateTimersAsync())
      }
      if (operation === "INIT"){
        await dispatch(ActivateTimerAsync(gameData.currentMove))
      }
    }
  }

  const updateBoardAction = () => {
    if (gameData && gameData.board) {
      const newBoard = gameData.board.getCopyBoard()
      // for re-rendering
      dispatch(updateBoardForRender(newBoard))
    }
  }



  const highlightCellsAction = () => {
    if (selectedCell && gameData && gameData.board) {
      dispatch(highlightCells(selectedCell))
    }
  }

   // check for mate or tie
  const checkForGameStatus = () => {
    if (gameData && gameData.gameActive && gameData.board) {
      if (ws && deepCopiedBoard.cells.length && deepCopiedBoard.isMate(gameData.currentMove)) {
        dispatch(showGameStatus())
        setSelectedCell(null)
        dispatch(endGame(gameData.currentMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE))
        ws.send(JSON.stringify({
          "method":SocketMethods.endGame,
          "lobbyId":gameData.lobbyId,
          "winnerColor":gameData.userColor,
        }))
      } else {
        if (ws && gameData && gameData.gameActive && deepCopiedBoard.cells.length && deepCopiedBoard.isTie(gameData.currentMove)){
          dispatch(showGameStatus())
          dispatch(endGame(null))
          ws.send(JSON.stringify({
            "method":SocketMethods.endGame,
            "lobbyId":gameData.lobbyId,
            "winnerColor":gameData.userColor,
          }))
          setSelectedCell(null)
        }
      }
    }
  }
  const updateBoardUi = () => {
    if (gameData && gameData.board) {
      if (selectedCell && selectedCell.figure && gameData.currentMove !== selectedCell.figure.color){
        // if not your your turn and you selected your piece - clear all available moves 
        gameData.board.clearAvailablePropertyInCells()
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
        if (gameData.userColor === gameData.currentMove) {
          if (ws && gameData.board) {
            if (selectedCell.figure?.canMove(selectedCell,targetCell,gameData.board) && deepCopiedBoard.cells.length &&  !deepCopiedBoard.kingWillBeUnderAttack(selectedCell,targetCell)) {
              let takenFigureThisMove : null | Figure = null
              if (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && selectedCell.figure.color === targetCell.figure.color) {
                // SWAP RULE
                selectedCell.figure.moveFigure(selectedCell,targetCell,gameData.board,true)
              } else {
                if (targetCell.figure) {
                  const figureInTargetCell = targetCell.figure as Figure
                  takenFigureThisMove = createFigureByProperties(figureInTargetCell)
                  dispatch(addTakenFigure(figureInTargetCell))
                }
                selectedCell.figure.moveFigure(selectedCell,targetCell,gameData.board)
              }
              makeTurnSound()
              ws.send(JSON.stringify({
                "method" : SocketMethods.makeMove,
                "updatedBoardCells" : gameData.board.cells,
                "wasMove" : gameData.currentMove,
                "lobbyId" : gameData.lobbyId,
                "clientTime":gameData.clientTimer.time,
                "enemyClientTime":gameData.enemyClientTimer.time,
                "whiteTakenFigures":takenFigureThisMove && takenFigureThisMove.color === Colors.WHITE ? [...gameData.whiteTakenFigures,takenFigureThisMove] : gameData.whiteTakenFigures,
                "blackTakenFigures":takenFigureThisMove && takenFigureThisMove.color === Colors.BLACK ? [...gameData.blackTakenFigures,takenFigureThisMove] : gameData.blackTakenFigures,
              }))
              dispatch(changeCurrentMove(gameData.currentMove === Colors.BLACK ? Colors.WHITE : Colors.BLACK))
              setSelectedCell(null)
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

    useEffect(() => {
      if (gameData && gameData.board) {
        updateBoardUi()
      }
    },[selectedCell])

    useEffect(() => {
      if (gameData && gameData.board) {
        if (gameData.clientTimer.intervalId === null && gameData.enemyClientTimer.intervalId === null && gameData.gameActive) {
          handleTimers("INIT")
        } 

        return () => {
          // clear data,when component umnmounts
          handleTimers("DEACTIVATE")
          if (gameData.gameActive === false) {
            dispatch(clearGameData())
          }
        }
      }
    },[gameData?.gameActive])


    useEffect(() => {
      if (gameData && gameData.board) {
          // make new deep copy board for finding available turns,if 0,then mate or tie
        setDeepCopiedBoard(gameData.board)
        checkForGameStatus()
        handleTimers("CHANGE")
      }
    },[gameData?.currentMove])


  useEffect(() => {
    // UseEffect,for checking game ending by time
    if (gameData && ws) {
      // update data in AWSS
      // TODO : fix updateTimeState system
      ws.send(JSON.stringify({
        "method" : SocketMethods.updateTimeState,
        "clientTime":gameData.clientTimer.time,
        "enemyClientTime":gameData.enemyClientTimer.time
      }))
      if (gameData && gameData.clientTimer.time <= 0 && ws) {
        handleTimers("DEACTIVATE").then(() => {
          ws.send(JSON.stringify({
            "method":SocketMethods.endGame,
            "lobbyId":gameData.lobbyId,
            "winnerColor" : gameData.userColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK
          }))
          dispatch(endGame(gameData.userColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK))
          dispatch(showGameStatus())
        })
      }
      if (gameData && gameData.enemyClientTimer.time <= 0 && ws) {
        handleTimers("DEACTIVATE").then(() => {
          ws.send(JSON.stringify({
            "method":SocketMethods.endGame,
            "lobbyId":gameData.lobbyId,
            "winnerColor":gameData.userColor,
          }))
          dispatch(endGame(gameData.userColor))
          dispatch(showGameStatus())
        })
      }


    }

  },[gameData?.clientTimer.time,gameData?.enemyClientTimer.time])


  return (
    <div className={scss.container}>
        {gameData && ws &&
        (
          <>
          {gameData.gameActive === false && (
            <div style={{'color':'white','fontSize':'10px','letterSpacing':'0.1rem'}}>User {gameData.winner === gameData.userColor ? user?.email : gameData.enemyUser.user.email} won</div>
          )}
          {gameData?.userColor === Colors.BLACK && (
            <BarToDisplayTakenFigures color={Colors.BLACK} takenFigures={gameData.blackTakenFigures}/>
          )}
          {gameData?.userColor === Colors.WHITE && (
            <BarToDisplayTakenFigures color={Colors.WHITE} takenFigures={gameData.whiteTakenFigures}/>
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
                {gameData.board?.cells.slice().reverse().map((cellRow:Cell[],index) => {
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
                  {gameData?.board?.cells.map((cellRow:Cell[],index) => {
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
            <BarToDisplayTakenFigures color={Colors.WHITE} takenFigures={gameData.whiteTakenFigures}/>
        )}
        {gameData?.userColor === Colors.WHITE && (
          <BarToDisplayTakenFigures color={Colors.BLACK} takenFigures={gameData.blackTakenFigures}/>
        )}
       </>
      )
    }
    </div>
  )
}

export default MultiPlayerBoardComponent