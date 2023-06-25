import React, { useEffect, useState } from 'react';
import css from './App.module.css';
import BoardComponent from './components/ChessComponents/BoardComponent/BoardComponent';
import SideBar from './components/ReactComponents/SideBar/SideBar';
import MainPage from './Pages/MainPage/MainPage';
import { Routes,Route } from 'react-router-dom';
import Layout from './components/ReactComponents/Layout/Layout';
import SinglePlayerBoardPage from './Pages/singlePlayerBoard/singlePlayerBoard';
import MultiPlayerBoard from './Pages/MultiPlayerBoard/MultiPlayerBoard';
import { useAppSelector } from './redux/hooks/useAppSelector';
import { AvailableWindows } from './redux/reducers/modalReducer';
import RegisterForm from './components/ReactComponents/RegisterForm/RegisterForm';
import LoginForm from './components/ReactComponents/LoginForm/LoginForm';
import ModalWindow from './components/ReactComponents/ModalWindow/ModalWindow';
function App() {
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  return (
    <>
        {showModal && showWindow === AvailableWindows.Register && (
            <ModalWindow children={<RegisterForm/>}/>
        )}
        {showModal && showWindow === AvailableWindows.Login && (
            <ModalWindow children={<LoginForm/>}/>
        )}
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route element={<MainPage/>} path='/'></Route>
            <Route element={<SinglePlayerBoardPage/>} path='/single-player'></Route>
            <Route element={<MultiPlayerBoard/>} path='/multi-player/:id'></Route>
          </Route>
        </Routes>
    </>
  );
}

export default App;
