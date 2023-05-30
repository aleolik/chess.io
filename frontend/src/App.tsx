import React, { useEffect, useState } from 'react';
import css from './App.module.css';
import BoardComponent from './components/ChessComponents/BoardComponent/BoardComponent';
import SideBar from './components/ReactComponents/SideBar/SideBar';
import MainPage from './Pages/MainPage/MainPage';
import { Routes,Route } from 'react-router-dom';
import Layout from './components/ReactComponents/Layout/Layout';
import SinglePlayerBoardPage from './Pages/singlePlayerBoard/singlePlayerBoard';
function App() {

  return (
    <Routes>
        <Route path='/' element={<Layout/>}>
          <Route element={<MainPage/>} path='/'></Route>
          <Route element={<SinglePlayerBoardPage/>} path='/single-player'></Route>
        </Route>
    </Routes>
  );
}

export default App;
