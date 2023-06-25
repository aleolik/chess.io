import React, { FC } from 'react'
import { Figure } from '../../../chess-logic/models/Figure'
import { Colors } from '../../../chess-logic/models/Colors'
import scss from './BarToDisplayTakenFigures.module.scss'

interface BarToDisplayTakenFiguresProps{
    color : Colors // display black figures at the top,white at the bottom
    takenFigures : Figure[]
}
const BarToDisplayTakenFigures : FC<BarToDisplayTakenFiguresProps> = ({takenFigures}) => {
  return (
    <div className={scss.bar}>
        {takenFigures.map((figure) => {
            return (
                <>
                    {figure.img && (
                        <img className={scss.figureInBar} src={figure.img} alt='figure'></img>
                    )}
                </>
            )
        })}
    </div>
  )
}

export default BarToDisplayTakenFigures