import React,{FC, useState}from 'react'
import scss from './MultiPlayerBoard.module.scss'
import { Board } from '../../chess-logic/models/Board'
import MultiPlayerBoardComponent from '../../components/ChessComponents/MultiPlayerBoardComponent/MultiPlayerBoardComponent'


const MultiPlayerBoard  = () => {
  const [board,setBoard] = useState<Board>(new Board())
  return (
    <MultiPlayerBoardComponent board={board} setBoard={setBoard}/>
  )
}

export default MultiPlayerBoard