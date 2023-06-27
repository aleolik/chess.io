import React,{FC, useEffect, useState}from 'react'
import scss from './MultiPlayerBoard.module.scss'
import { Board } from '../../chess-logic/models/Board'
import MultiPlayerBoardComponent from '../../components/ChessComponents/MultiPlayerBoardComponent/MultiPlayerBoardComponent'
import userInstance from '../../axios/userInstance'

const MultiPlayerBoard  = () => {
  const [board,setBoard] = useState<Board | null>(null)
  useEffect(() => {
    userInstance.get("chess/get-new-board/").then((res) => {
      const data = res.data as {board : Board}
      setBoard(data.board)
    }).catch((e) => {
      
    })
  },[])
  return (
    <>
      {board && (
        <MultiPlayerBoardComponent board={board} setBoard={setBoard}/>
      )}
    </>
  )
}

export default MultiPlayerBoard