import React, { FC, SetStateAction, useEffect, useState,Dispatch } from 'react'
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

interface BoardProps{
  board : Board,
  setBoard : (board:Board) => void,
  isWhiteTurn : boolean,
  setIsWhiteTurn : (isWhiteTurn:boolean) => void,
  isBlackTurn : boolean,
  setIsBlackTurn : (isWhiteTurn:boolean) => void,
  selectedCell : Cell | null,
  setSelectedCell : (cell : Cell | null) => void
  isWinner : Colors | null,
  setIsWinner : (isWinner : Colors | null) => void
  whiteTakenFigures : Figure[]
  setWhiteTakenFigures : Dispatch<SetStateAction<Figure[]>>
  blackTakenFigures : Figure[]
  setBlackTakenFigures : Dispatch<SetStateAction<Figure[]>>
}
const BoardComponent : FC<BoardProps> = ({board,setBoard,isWhiteTurn,setIsWhiteTurn,isBlackTurn,setIsBlackTurn,selectedCell,setSelectedCell,isWinner,setIsWinner,blackTakenFigures,setBlackTakenFigures,whiteTakenFigures,setWhiteTakenFigures}) => {
  const [deepCopiedBoard,setDeepCopiedBoard] = useState<Board>(new Board())
  const [makeTurnSound] = useSound(makeTurn)
  const dispatch = useAppDispatch()
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  const showGameStatus = modalSlice.actions.showGameStatus
  useEffect(() => {
    if (board.cells.length && board.isMate(isWhiteTurn ? Colors.WHITE : Colors.BLACK)) {
      setIsWinner(isWhiteTurn ? Colors.BLACK : Colors.WHITE)
      dispatch(showGameStatus())
      setSelectedCell(null)
      return;
    }
    if (!isWinner && board.cells.length && board.isTie(isWhiteTurn ? Colors.WHITE : Colors.BLACK)){
      dispatch(showGameStatus())
      setIsWinner(null)
      return;
    }
  },[isWhiteTurn,isBlackTurn])

  const cellOnClick = (targetCell:Cell) => {
    if (isWinner) return;
    const deepCopyBoard = board.getDeepCopyBoard()
    if (selectedCell && selectedCell.figure && selectedCell.figure.canMove(selectedCell,targetCell,board) && !deepCopyBoard.kingWillBeUnderAttack(selectedCell,targetCell,deepCopyBoard)){
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

  const highlightCells = () => {
    if (selectedCell) {
      board.highlightCells(selectedCell)
    }
  }

  const updateBoard = () => {
    const newBoard = board.getCopyBoard()
    // for re-rendering
    setBoard(newBoard)
  }

  useEffect(() => {
    if (board === null || selectedCell === null) return;
    // for re-rendering
    updateBoard()
    highlightCells()
  },[selectedCell])
  
  return (
    <div>
        <BarToDisplayTakenFigures takenFigures={whiteTakenFigures} color={Colors.WHITE}/>
        {showModal && showWindow === AvailableWindows.GameStatus && (
          <ModalWindow children={<GameStatusWindow isWinner={isWinner}/>}/>
        )}
        <div className={scss.board}>
          <>
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
            </>
      </div>
      <BarToDisplayTakenFigures takenFigures={blackTakenFigures} color={Colors.BLACK}/>
    </div>
  )
}

export default BoardComponent


