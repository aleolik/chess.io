import React, { useEffect, useState } from 'react';
import css from './App.module.css';
import BoardComponent from './components/ChessComponents/BoardComponent/BoardComponent';
import { Board } from './models/Board';
import SideBar from './components/ReactComponents/SideBar/SideBar';

function App() {

  const [board,setBoard] = useState<Board>(new Board())

  const restart = () => {
    const newBoard = new Board()
    newBoard.initCells()
    newBoard.addFigures()
    setBoard(newBoard)
  }

  useEffect(() => {
    restart()
  },[])


  return (
    <div className={css.mainContainer}>
        <SideBar/>
        <div className={css.Game}>
              <BoardComponent board={board} setBoard={setBoard}/>
        </div>
    </div>
  );
}

export default App;
