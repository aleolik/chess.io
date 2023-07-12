import React, { FC, useEffect, useState } from 'react'
import { IUser } from '../../../interfaces/IUser'
import scss from './MultiPlayerBoardComponent.module.scss'
import { Cell } from '../../../chess-logic/models/Cell'
import CellComponent from '../CellComponent/CellComponent'
import useSound from 'use-sound'
import makeTurn from '../../../assets/makeTurn.mp3'
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


interface MultiPlayerBoardComponentProps{
    user : {user : IUser,color:Colors},
    enemyUser : {user : IUser,color:Colors},
    lobbyId : string,
}

interface ITimer{
  time : number,
  intervalId : ReturnType<typeof setInterval> | null
}

function setTimers(activeTimer:ITimer,setActiveTimer:React.Dispatch<React.SetStateAction<ITimer>>,unactiveTimer:ITimer,setUnactiveTimer:React.Dispatch<React.SetStateAction<ITimer>>){
  const intervalId = setInterval(() => {
    setActiveTimer(prevState => ({
      ...prevState,
      time : prevState.time - 1
    }))
  },1000)
  setActiveTimer({
    ...activeTimer,
    intervalId : intervalId
  })


  if (unactiveTimer.intervalId){
    clearInterval(unactiveTimer.intervalId)
    setUnactiveTimer({
      ...unactiveTimer,
      intervalId : null
    })
  }
}

function clearTimers(timer:ITimer,setTimer:React.Dispatch<React.SetStateAction<ITimer>>,enemyTimer:ITimer,setEnemyTimer:React.Dispatch<React.SetStateAction<ITimer>>){
  if (timer.intervalId) {
    clearInterval(timer.intervalId)
    setTimer({
      ...timer,
      intervalId : null
    })
  }
  if (enemyTimer.intervalId){
    clearInterval(enemyTimer.intervalId)
    setEnemyTimer({
      ...enemyTimer,
      intervalId : null
    })
  }
}


const MultiPlayerBoardComponent : FC<MultiPlayerBoardComponentProps> = ({enemyUser,user,lobbyId}) => {
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const [makeTurnSound] = useSound(makeTurn)
  const {ws} = useAppSelector(state => state.webSocket)
  const {board,currentMove,whiteTakenFigures,blackTakenFigures} = useAppSelector(state => state.board)
  const {updateBoard,changeCurrentMove,addBlackTakenFigure,addWhiteTakenFigure} = boardSlice.actions
  const dispatch = useAppDispatch()
  const [winner,setWinner] = useState<Colors | null | undefined>(undefined)
  const [timer,setTimer] = useState<ITimer>({
    time : 60 * 10, // seconds
    intervalId : null // there is an interval if it is player's turn
  })
  const [enemyTimer,setEnemyTimer] = useState<ITimer>({
    time : 60 * 10, // seconds
    intervalId : null // there is an interval if it is player's turn
  })
  const showGameStatus = modalSlice.actions.showGameStatus
  const {showModal,showWindow} = useAppSelector(state => state.modal)



  const cellOnClick = (targetCell : Cell) => {
      if (selectedCell && (selectedCell.figure?.color !== targetCell.figure?.color || (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && targetCell.figure.color === selectedCell.figure.color))){
         if (user.color === currentMove) {
            if (ws && board) {
              let takenFigureThisMove : null | Figure = null
              const deepCopyBoard = board.getDeepCopyBoard()
              if (selectedCell.figure?.canMove(selectedCell,targetCell,board) && !deepCopyBoard.kingWillBeUnderAttack(selectedCell,targetCell,deepCopyBoard)) {
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
                  method : SocketMethods.makeMove,
                  cells : board.getCellsPropertiesWithoutImg(),
                  currentMove : currentMove,
                  lobbyId : lobbyId,
                  takenFigureThisMove : takenFigureThisMove ? {
                    id : takenFigureThisMove.id,
                    color : takenFigureThisMove.color,
                    name : takenFigureThisMove.name,
                  } : null,
                }))
                dispatch(changeCurrentMove(currentMove === Colors.BLACK ? Colors.WHITE : Colors.BLACK))
                setSelectedCell(null)
                makeTurnSound()
              }
            }
         }
      } else {
        if (!targetCell.figure) return;
        if (targetCell.figure.color !== user.color) return;
        setSelectedCell(targetCell)
      }
  }

  const updateBoardAction = () => {
    if (board) {
      const newBoard = board.getCopyBoard()
      // for re-rendering
      dispatch(updateBoard(newBoard))
    }
  }



  const highlightCells = () => {
    if (selectedCell && board) {
      board.highlightCells(selectedCell)
    }
  }

  useEffect(() => {
    if (!board?.cells?.length || !selectedCell) return;
    if (selectedCell.figure && currentMove !== selectedCell.figure.color){
      // if not your your turn and you selected your piece - clear all available moves 
      board.clearAvailablePropertyInCells()
      return;
    }
    // for re-rendering
    updateBoardAction()
    highlightCells()
  },[selectedCell])






  useEffect(() => {
    // check for mate or tie
    if (board && board.cells.length && winner === undefined) {

      // change timer.isActive and enemyTimer.isActive properties
      if (currentMove === user.color) {
        // userTimer is set to active and enemyTimer to unactive
        setTimers(timer,setTimer,enemyTimer,setEnemyTimer)
      } else {
        // enemyTime is set to active and userTimer to unactive
        setTimers(enemyTimer,setEnemyTimer,timer,setTimer)
      }

      // check game status
      if (board.isMate(currentMove)) {
        setWinner(currentMove === Colors.WHITE ? Colors.BLACK : Colors.WHITE)
        dispatch(showGameStatus())
        setSelectedCell(null)
        clearTimers(timer,setTimer,enemyTimer,setEnemyTimer)
        return;
      }
      if (!winner && board.isTie(currentMove)){
        setWinner(null)
        dispatch(showGameStatus())
        setSelectedCell(null)
        clearTimers(timer,setTimer,enemyTimer,setEnemyTimer)
        return;
      }
    }
  },[currentMove])


  return (
    <div>
        {user.color === Colors.BLACK && (
          <BarToDisplayTakenFigures color={Colors.BLACK} takenFigures={blackTakenFigures}/>
        )}
         {user.color === Colors.WHITE && (
          <BarToDisplayTakenFigures color={Colors.WHITE} takenFigures={whiteTakenFigures}/>
        )}
        {showModal && showWindow === AvailableWindows.GameStatus && winner !== undefined && (
            <ModalWindow children={<GameStatusWindow isWinner={winner}/>}/>
        )}
        <TimeTransformation time={enemyTimer.time}/>
        <div className={scss.board}>
          <>
            {user.color && user.color === Colors.BLACK
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
      <TimeTransformation time={timer.time}/>
      {user.color === Colors.BLACK && (
          <BarToDisplayTakenFigures color={Colors.WHITE} takenFigures={whiteTakenFigures}/>
      )}
      {user.color === Colors.WHITE && (
        <BarToDisplayTakenFigures color={Colors.BLACK} takenFigures={blackTakenFigures}/>
      )}
    </div>
  )
}

export default MultiPlayerBoardComponent