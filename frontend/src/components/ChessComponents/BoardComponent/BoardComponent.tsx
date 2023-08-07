import React, { FC, SetStateAction, useEffect, useState,Dispatch, MutableRefObject } from 'react'
import scss from './BoardComponent.module.scss'
import CellComponent from '../CellComponent/CellComponent'
import { Board } from '../../../chess-logic/models/Board'
import { Cell } from '../../../chess-logic/models/Cell'
import { Colors } from '../../../chess-logic/models/Colors'
import useSound from 'use-sound'
import makeTurn from '../../../assets/makeTurn.mp3'
import { King } from '../../../chess-logic/figures/King'
import { Rook } from '../../../chess-logic/figures/Rook'
import { Figure } from '../../../chess-logic/models/Figure'
import BarToDisplayTakenFigures from '../BarToDisplayTakenFigures/BarToDisplayTakenFigures'
import ModalWindow, { GameStatusWindow } from '../../ReactComponents/ModalWindow/ModalWindow'
import { useAppDispatch } from '../../../redux/hooks/useAppDispatch'
import { AvailableWindows, modalSlice } from '../../../redux/reducers/modalReducer'
import { useAppSelector } from '../../../redux/hooks/useAppSelector'
import RestartBoardButton from '../RestartBoardButton/RestartBoardButton'

const BoardComponent = () => {
  const [board,setBoard] = useState<Board>(new Board())
  const [isWhiteTurn,setIsWhiteTurn] = useState<boolean>(false)
  const [isBlackTurn,setIsBlackTurn] = useState<boolean>(false)
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const [isWinner,setIsWinner] = useState<null | Colors>(null)
  const [whiteTakenFigures,setWhiteTakenFigures] = useState<Figure[]>([])
  const [blackTakenFigures,setBlackTakenFigures] = useState<Figure[]>([])
  const [deepCopiedBoard,setDeepCopiedBoard] = useState<Board>(new Board())
  const [makeTurnSound] = useSound(makeTurn)
  const dispatch = useAppDispatch()
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  const showGameStatus = modalSlice.actions.showGameStatus

  useEffect(() => {
    setDeepCopiedBoard(board)
    if (deepCopiedBoard.cells.length && deepCopiedBoard.isMate(isWhiteTurn ? Colors.WHITE : Colors.BLACK)) {
      setIsWinner(isWhiteTurn ? Colors.BLACK : Colors.WHITE)
      dispatch(showGameStatus())
      setSelectedCell(null)
    } else {
      if (isWinner === null && deepCopiedBoard.cells.length && deepCopiedBoard.isTie(isWhiteTurn ? Colors.WHITE : Colors.BLACK)){
        dispatch(showGameStatus())
        setIsWinner(null)
      }
    }
  },[isWhiteTurn,isBlackTurn])

  const cellOnClick = (targetCell:Cell) => {
    if (isWinner === null) {
      if (selectedCell && selectedCell.figure && deepCopiedBoard.cells.length && selectedCell.figure.canMove(selectedCell,targetCell,deepCopiedBoard) && !deepCopiedBoard.kingWillBeUnderAttack(selectedCell,targetCell)){
        if (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && selectedCell.figure.color === targetCell.figure.color) {
          // SWAP RULE
          selectedCell.figure.moveFigure(selectedCell,targetCell,board,true)
        } else {
          if (targetCell.figure) {
            const figureInTargetCell = targetCell.figure as Figure
            if (targetCell.figure.color === Colors.WHITE) {
              setWhiteTakenFigures(prevState => ([...prevState,figureInTargetCell]))
            } else {
              setBlackTakenFigures(prevState => ([...prevState,figureInTargetCell]))
            }   
          }
          selectedCell.figure.moveFigure(selectedCell,targetCell,board)
        }
        makeTurnSound()
        setSelectedCell(null)
        if (isWhiteTurn) {
          setIsWhiteTurn(false)
          setIsBlackTurn(true)
        } else {
          setIsWhiteTurn(true)
          setIsBlackTurn(false)
        }
    } else {
      if (!targetCell.figure) return;
      if (targetCell.figure.color === Colors.WHITE && !isWhiteTurn) return;
      if (targetCell.figure.color === Colors.BLACK && !isBlackTurn) return;
      setSelectedCell(targetCell)
    }
    }  
  }

  const highlightCells = (selectedCell:Cell) => {
    if (deepCopiedBoard.cells.length) {
      deepCopiedBoard.highlightCells(selectedCell)
    }
  }

  const updateBoard = () => {
    const newBoard = board.getCopyBoard()
    setBoard(newBoard)
  }

  const restart = (buttonRef  : MutableRefObject<HTMLButtonElement | null>) => {
    const newBoard = new Board()
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setDeepCopiedBoard(newBoard)
    setIsWhiteTurn(true)
    setIsBlackTurn(false)
    setSelectedCell(null)
    setIsWinner(null)
    setWhiteTakenFigures([])
    setBlackTakenFigures([])
    // disable button for 1.5 seconds
    if (!buttonRef.current) return;
    buttonRef.current.disabled = true
    setTimeout(() => {
        if (!buttonRef.current) return;
        buttonRef.current.disabled = false
    },1500);
  }

  useEffect(() => {
    if (deepCopiedBoard.cells.length && selectedCell) {
      // for re-rendering
      updateBoard()
      // highlight available moves for user
      highlightCells(selectedCell)
    }
  },[selectedCell])




  
  return (
    <div className={scss.container}>
        <BarToDisplayTakenFigures takenFigures={whiteTakenFigures} color={Colors.WHITE}/>
        {showModal && showWindow === AvailableWindows.GameStatus && (
          <ModalWindow children={<GameStatusWindow isWinner={isWinner}/>}/>
        )}
        <div className={scss.board}>
            {board.cells.map((cellRow:Cell[],index) => {
              return (
                <React.Fragment key={index}>
                  {cellRow.map((cell) => {
                    return (
                      <CellComponent
                        onClick={cellOnClick} 
                        cell={cell}
                        selectedCell={selectedCell}
                        key={cell.id}
                      />
                    )
                  })}
                </React.Fragment>
              )
            })}
      </div>
      <BarToDisplayTakenFigures takenFigures={blackTakenFigures} color={Colors.BLACK}/>
      <RestartBoardButton restart={restart}/>
    </div>
  )
}

export default BoardComponent


