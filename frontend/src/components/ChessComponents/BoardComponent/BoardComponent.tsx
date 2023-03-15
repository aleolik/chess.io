import React, { FC, useEffect, useState } from 'react'
import scss from './BoardComponent.module.scss'
import CellComponent from '../CellComponent/CellComponent'
import { Board } from '../../../models/Board'
import { Cell } from '../../../models/Cell'

interface BoardProps{
  board : Board,
  setBoard : (board:Board) => void
}
const BoardComponent : FC<BoardProps> = ({board,setBoard}) => {
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)

  const cellOnClick = (cell:Cell) => {
    if (selectedCell && selectedCell !== cell && selectedCell.figure && selectedCell.figure.canMove(cell)){
      selectedCell.moveFigure(cell)
      setSelectedCell(null)
      return;
    }
    if (!cell.figure) return;
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


