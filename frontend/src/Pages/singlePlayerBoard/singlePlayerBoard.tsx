import React, { useEffect, useState } from 'react'
import { Board } from '../../models/Board'
import BoardComponent from '../../components/ChessComponents/BoardComponent/BoardComponent'
import scss from './singlePlayerBoard.module.scss'

const SinglePlayerBoardPage = () => {
  const [board,setBoard] = useState<Board>(new Board())
  const [isWhiteTurn,setIsWhiteTurn] = useState<boolean>(true)
  const [isBlackTurn,setIsBlackTurn] = useState<boolean>(false)

  const restart = () => {
    const newBoard = new Board()
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setIsWhiteTurn(true)
    setIsBlackTurn(false)
    // disable button for 3 seconds
    
    setTimeout(() => {
      
    },3000);
  }

  useEffect(() => {
      restart()
  },[])
  return (
    <div className={scss.container}>
        <button className={[`btn btn-primary`,scss.restartButton].join(' ')}  onClick={(e) => restart()}>Restart game</button>
        <BoardComponent isWhiteTurn={isWhiteTurn} setIsWhiteTurn={setIsWhiteTurn} isBlackTurn={isBlackTurn} setIsBlackTurn={setIsBlackTurn}  board={board} setBoard={setBoard}/>
    </div>
  )
}

export default SinglePlayerBoardPage