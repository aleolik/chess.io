import React, { useEffect, useRef, useState } from 'react'
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


const MultiPlayerBoardComponent = () => {
  const {ws,gameData} = useAppSelector(state => state.webSocket)
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const [makeTurnSound] = useSound(turnTickAudio)
  const [deepCopiedBoard,setDeepCopiedBoard] = useState<Board>(new Board())
  const {highlightCells,changeCurrentMove,updateBoardForRender,addTakenFigure,clearGameData} = webSocketSlice.actions
  const dispatch = useAppDispatch()
  const showGameStatus = modalSlice.actions.showGameStatus
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  const user = useAppSelector(state => state.user.user)
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)


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
        setSelectedCell(null)
        ws.send(JSON.stringify({
          "method":SocketMethods.endGame,
          "winnerColor":gameData.userColor,
        }))
      } else {
        if (ws && gameData && gameData.gameActive && deepCopiedBoard.cells.length && deepCopiedBoard.isTie(gameData.currentMove)){
          ws.send(JSON.stringify({
            "method":SocketMethods.endGame,
            "winnerColor":null,
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
              // variable used to store figure that was in attacked cell in memory,to send it later in socket action
              let takenFigure : null | Figure = null
              if (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && selectedCell.figure.color === targetCell.figure.color) {
                // SWAP RULE
                selectedCell.figure.moveFigure(selectedCell,targetCell,gameData.board,true)
              } else {
                if (targetCell.figure) {
                  const figureInTargetCell = targetCell.figure as Figure
                  takenFigure = createFigureByProperties(figureInTargetCell)
                  dispatch(addTakenFigure(figureInTargetCell))
                }
                selectedCell.figure.moveFigure(selectedCell,targetCell,gameData.board)
              }
              makeTurnSound()
              ws.send(JSON.stringify({
                "method" : SocketMethods.makeMove,
                "updatedBoardCells" : gameData.board.cells,
                "takenFigure":takenFigure,
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
      // make new deep copy board for finding available turns,if 0,then mate or tie
      setDeepCopiedBoard(gameData.board)
      checkForGameStatus()
    }
  },[gameData?.currentMove])

  useEffect(() => {
    if (gameData && gameData.winner === null && intervalId.current === null) {
      intervalId.current = setInterval(() => {
        if (gameData && ws) {
          ws.send(JSON.stringify({
            "method" : SocketMethods.updateTimeState,
          }))
        }
      },1000)
    }
    // cleanup
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
        intervalId.current = null
      }
    }
  },[gameData?.winner])


  


  return (
    <div className={scss.container}>
        {gameData && ws &&
        (
          <>
          {gameData.gameActive === false && (
            <div style={{'color':'white','fontSize':'10px','letterSpacing':'0.1rem'}}>User {gameData.winner === gameData.userColor ? user?.email : gameData.enemyUser.user.email} won</div>
          )}
          {gameData && gameData.userColor === Colors.BLACK
          ? (<BarToDisplayTakenFigures  takenFigures={gameData.blackTakenFigures}/>)
          : (<BarToDisplayTakenFigures  takenFigures={gameData.whiteTakenFigures}/>)
          }

          {showModal && showWindow === AvailableWindows.GameStatus && gameData && !gameData.gameActive && (
              <ModalWindow children={<GameStatusWindow isWinner={gameData.winner}/>}/>
          )}
          <div className={scss.text}>{gameData?.enemyUser?.user?.username}</div>
          {gameData && (
            <TimeTransformation time={gameData.enemyClientTime}/>
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
            <TimeTransformation time={gameData.clientTime}/>
        )}
        <div className={scss.text}>{user?.username}</div>
        {gameData && gameData.userColor === Colors.BLACK
          ? (<BarToDisplayTakenFigures  takenFigures={gameData.whiteTakenFigures}/>)
          : (<BarToDisplayTakenFigures  takenFigures={gameData.blackTakenFigures}/>)
          }

       </>
      )
    }
    </div>
  )
}

export default MultiPlayerBoardComponent