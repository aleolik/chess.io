import React, { useEffect, useRef, useState } from 'react'
import { Board } from '../../chess-logic/models/Board'
import BoardComponent from '../../components/ChessComponents/BoardComponent/BoardComponent'
import scss from './singlePlayerBoard.module.scss'
import { Cell } from '../../chess-logic/models/Cell'
import publicInstance from '../../axios/publicInstance'

const SinglePlayerBoardPage = () => {
  const [board,setBoard] = useState<Board>(new Board())
  const [isWhiteTurn,setIsWhiteTurn] = useState<boolean>(false)
  const [isBlackTurn,setIsBlackTurn] = useState<boolean>(false)
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const restart = () => {
    const newBoard = new Board()
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setIsWhiteTurn(true)
    setIsBlackTurn(false)
    setSelectedCell(null)
    // disable button for 1.5 seconds
    if (!buttonRef.current) return;
    buttonRef.current.disabled = true
    setTimeout(() => {
        if (!buttonRef.current) return;
        buttonRef.current.disabled = false
    },1500);
  }

  useEffect(() => {
      restart()
  },[])
  return (
    <div className={scss.container}>
        <button ref={buttonRef} className={[`btn btn-primary`,scss.restartButton].join(' ')}  onClick={(e) => restart()}>Restart game</button>
        <BoardComponent selectedCell={selectedCell} setSelectedCell={setSelectedCell} isWhiteTurn={isWhiteTurn} setIsWhiteTurn={setIsWhiteTurn} isBlackTurn={isBlackTurn} setIsBlackTurn={setIsBlackTurn}  board={board} setBoard={setBoard}/>
    </div>
  )
}

export default SinglePlayerBoardPage