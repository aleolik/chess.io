import React, { useEffect, useRef, useState } from 'react'
import { Board } from '../../chess-logic/models/Board'
import BoardComponent from '../../components/ChessComponents/BoardComponent/BoardComponent'
import scss from './singlePlayerBoard.module.scss'
import { Cell } from '../../chess-logic/models/Cell'
import publicInstance from '../../axios/publicInstance'
import { Colors } from '../../chess-logic/models/Colors'
import { Figure } from '../../chess-logic/models/Figure'

const SinglePlayerBoardPage = () => {
  const [board,setBoard] = useState<Board>(new Board())
  const [isWhiteTurn,setIsWhiteTurn] = useState<boolean>(false)
  const [isBlackTurn,setIsBlackTurn] = useState<boolean>(false)
  const [selectedCell,setSelectedCell] = useState<null | Cell>(null)
  const [isWinner,setIsWinner] = useState<null | Colors>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [whiteTakenFigures,setWhiteTakenFigures] = useState<Figure[]>([])
  const [blackTakenFigures,setBlackTakenFigures] = useState<Figure[]>([])

  const restart = () => {
    const newBoard = new Board()
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
    setIsWhiteTurn(true)
    setIsBlackTurn(false)
    setSelectedCell(null)
    setIsWinner(null)
    setWhiteTakenFigures([])
    setBlackTakenFigures([])
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
        <BoardComponent blackTakenFigures={blackTakenFigures} setBlackTakenFigures={setBlackTakenFigures} whiteTakenFigures={whiteTakenFigures} setWhiteTakenFigures={setWhiteTakenFigures} isWinner={isWinner} setIsWinner={setIsWinner} selectedCell={selectedCell} setSelectedCell={setSelectedCell} isWhiteTurn={isWhiteTurn} setIsWhiteTurn={setIsWhiteTurn} isBlackTurn={isBlackTurn} setIsBlackTurn={setIsBlackTurn}  board={board} setBoard={setBoard}/>
        <button ref={buttonRef} className={[`btn btn-primary`,scss.restartButton].join(' ')}  onClick={(e) => restart()}>Restart game</button>
    </div>
  )
}

export default SinglePlayerBoardPage