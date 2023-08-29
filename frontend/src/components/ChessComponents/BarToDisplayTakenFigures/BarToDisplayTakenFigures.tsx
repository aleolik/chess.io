import React, { FC } from 'react'
import { Figure } from '../../../chess-logic/models/Figure'
import { Colors } from '../../../chess-logic/models/Colors'
import scss from './BarToDisplayTakenFigures.module.scss'

interface BarToDisplayTakenFiguresProps{
    takenFigures : Figure[]
}
const BarToDisplayTakenFigures : FC<BarToDisplayTakenFiguresProps> = ({takenFigures}) => {
  return (
    <div className={scss.bar}>
        {takenFigures.map((figure) => {
            return (
                <div key={figure.id}>
                    {figure.img && (
                        <img className={scss.figureInBar} src={figure.img} alt='figure'></img>
                    )}
                </div>
            )
        })}
    </div>
  )
}

export default BarToDisplayTakenFigures