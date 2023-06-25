import React, { FC, useEffect, useMemo, useState } from 'react'
import scss from './CellComponent.module.scss'
import { Cell, availableCoordinates } from '../../../chess-logic/models/Cell'
import { Colors } from '../../../chess-logic/models/Colors'

interface CellProps{
    cell : Cell
    selectedCell : null | Cell
    onClick : (cell:Cell) => void
}


const convertNumToLetterByChessRules = (i : availableCoordinates) : string => {
  const dict : { [id : number] : string} = {
    0 : 'a',
    1 : 'b',
    2 : 'c',
    3 : 'd',
    4 : 'e',
    5 : 'f',
    6: 'g',
    7: 'h',
  }

  return dict[i]
  
}


const CellComponent : FC<CellProps> = ({cell,onClick,selectedCell}) => {

  const [cellStyles,setCellStyles] = useState<typeof scss.cell[]>([scss.cell])

  useEffect(() => {

    if (selectedCell && selectedCell.id === cell.id) {
      setCellStyles([scss.cell,scss.selected])
      return;
    }

    const cellColor = cell.color === Colors.WHITE
    ? scss.white : scss.black

    setCellStyles([scss.cell,cellColor])

  },[selectedCell])


  const onDragStart = (e  : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDragLeave = (e  : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDragEvent = (e  : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDrop = (e  : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  } 

  const onDragEnd = (e  : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  return (
    <div onClick={() => onClick(cell)} style={{'background':cell.available && cell.figure && selectedCell ? 'lightgreen' : ''}} className={cellStyles.join(' ')}>
          {/* first column */}
          {cell.j === 0 && (
            <div className={scss.x_cordinat}>{cell.i}</div>
          )}
          {/* last row */}
          {cell.i === 7 && (
            <div className={scss.y_cordinat}>{convertNumToLetterByChessRules(cell.j)}</div>
          )}
          {cell.figure?.img && (
            <div draggable={true}>
              <img
              className={scss.figure} src={cell.figure.img} alt='figure'>
              </img>
            </div>
          )}
          {selectedCell && cell.available && !cell.figure && (
            <div className={scss.available}></div>
          )}
    </div>
  )
}

export default CellComponent