import React, { FC } from 'react'
import { Board } from '../../../chess-logic/models/Board'

interface MultiPlayerBoardComponentProps{
    board : Board,
    setBoard : (board : Board) => void
}


const MultiPlayerBoardComponent : FC<MultiPlayerBoardComponentProps> = () => {
  return (
    <div>MultiPlayerBoardComponent</div>
  )
}

export default MultiPlayerBoardComponent