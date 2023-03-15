import React, { FC, useEffect, useMemo, useState } from 'react'
import scss from './CellComponent.module.scss'
import { Cell } from '../../../models/Cell'
import { Colors } from '../../../models/Colors'

interface CellProps{
    cell : Cell
    selectedCell : null | Cell
    onClick : (cell:Cell) => void
}



const CellComponent : FC<CellProps> = ({cell,onClick,selectedCell}) => {

  const [cellStyles,setCellStyles] = useState([scss.cell])

  useEffect(() => {

    if (selectedCell && selectedCell.id === cell.id) {
      setCellStyles([scss.selected,scss.cell])
      return;
    }

    const cellColor = cell.color === Colors.WHITE
    ? scss.white : scss.black

    setCellStyles([scss.cell,cellColor])

  },[selectedCell])

  return (
    <div onClick={() => onClick(cell)} style={{'background':cell.available && cell.figure && selectedCell ? 'lightgreen' : ''}} className={cellStyles.join(' ')}>
          {cell.figure?.img && (
            <img className={scss.figure} src={cell.figure.img} alt='figure'></img>
          )}
          {selectedCell && cell.available && !cell.figure && (
            <div className={scss.available}></div>
          )}
    </div>
  )
}

export default CellComponent