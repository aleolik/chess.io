import React, { FC, useEffect, useState } from 'react'
import scss from './BoardComponent.module.scss'
import CellComponent from '../CellComponent/CellComponent'
import { Board } from '../../../chess-logic/models/Board'
import { Cell } from '../../../chess-logic/models/Cell'
import { Colors } from '../../../chess-logic/models/Colors'
import useSound from 'use-sound'
import makeTurn from '../../../assets/makeTurn.mp3'
import { King } from '../../../chess-logic/figures/King'
import { Rook } from '../../../chess-logic/figures/Rook'

interface BoardProps{
  board : Board,
  setBoard : (board:Board) => void,
  isWhiteTurn : boolean,
  setIsWhiteTurn : (isWhiteTurn:boolean) => void,
  isBlackTurn : boolean,
  setIsBlackTurn : (isWhiteTurn:boolean) => void,
  selectedCell : Cell | null,
  setSelectedCell : (cell : Cell | null) => void
}
const BoardComponent : FC<BoardProps> = ({board,setBoard,isWhiteTurn,setIsWhiteTurn,isBlackTurn,setIsBlackTurn,selectedCell,setSelectedCell}) => {
  const [makeTurnSound] = useSound(makeTurn)

  const cellOnClick = (targetCell:Cell) => {
    if (selectedCell && selectedCell !== targetCell && selectedCell.figure && selectedCell.figure.color !== targetCell.figure?.color || (selectedCell?.figure instanceof King && targetCell.figure instanceof Rook && selectedCell.figure.color === targetCell.figure.color)){
      const deepCopyBoard = board.getDeepCopyBoard()
      if (selectedCell.figure.canMove(selectedCell,targetCell,board)){
        // if (board.kingIsUnderAttack(isWhiteTurn ? Colors.WHITE : Colors.BLACK)){
        //   if (!selectedCell.figure.canProtectKing(selectedCell,targetCell,isWhiteTurn ? Colors.WHITE : Colors.BLACK,board)){
        //     return;
        //   }
        // }
        if (deepCopyBoard && !board.kingWillBeUnderAttack(selectedCell,targetCell,deepCopyBoard)) {
          // SWAP 
          if (selectedCell.figure instanceof King && targetCell.figure instanceof Rook && selectedCell.figure.color === targetCell.figure.color) {
            selectedCell.figure.moveFigure(selectedCell,targetCell,board,true)
          } else {
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
        }
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
    // for re-rendering
    updateBoard()
    highlightCells()
  },[selectedCell])
  
  return (
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
  )
}

export default BoardComponent


