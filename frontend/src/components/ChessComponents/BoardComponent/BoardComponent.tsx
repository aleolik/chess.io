import React, { FC, useEffect, useState } from 'react'
import scss from './BoardComponent.module.scss'
import CellComponent from '../CellComponent/CellComponent'
import { Board } from '../../../models/Board'
import { Cell } from '../../../models/Cell'
import { Colors } from '../../../models/Colors'

interface BoardProps{
  board : Board,
  setBoard : (board:Board) => void,
  isWhiteTurn : boolean,
  setIsWhiteTurn : (isWhiteTurn:boolean) => void,
  isBlackTurn : boolean,
  setIsBlackTurn : (isWhiteTurn:boolean) => void,
}
const BoardComponent : FC<BoardProps> = ({board,setBoard,isWhiteTurn,setIsWhiteTurn,isBlackTurn,setIsBlackTurn}) => {
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)

  const cellOnClick = (cell:Cell) => {
    if (selectedCell && selectedCell !== cell && selectedCell.figure && selectedCell.figure.canMove(cell)){
      selectedCell.moveFigure(cell)
      setSelectedCell(null)
      if (isWhiteTurn) {
        setIsWhiteTurn(false)
        setIsBlackTurn(true)
      } else {
        setIsWhiteTurn(true)
        setIsBlackTurn(false)
      }
      return;
    }
    if (!cell.figure) return;
    if (cell.figure.color === Colors.WHITE && !isWhiteTurn) return;
    if (cell.figure.color === Colors.BLACK && !isBlackTurn) return;
    setSelectedCell(cell)
  }

  const highlightCells = () => {
    board.highlightCells(selectedCell)
    // for re-rendering
    updateBoard()
  }

  const updateBoard = () => {
    const newBoard = board.getCopyBoard()
    // for re-rendering
    setBoard(newBoard)
  }

  useEffect(() => {
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


