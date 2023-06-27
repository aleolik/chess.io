import React, { useEffect } from 'react';
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
import { IUser } from './interfaces/IUser';
import jwtDecode from 'jwt-decode';
import { userSlice } from './redux/reducers/userReducer';
import { useAppDispatch } from './redux/hooks/useAppDispatch';
import userInstance from './axios/userInstance';
function App() {
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  const userLoad = userSlice.actions.userLoad
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token){
      // userInstance.get("/user/check").then((res) => {
      //   const data = res.data as {token : string}
      //   const user : IUser = jwtDecode(data.token)
      //   dispatch(userLoad(user))
      // })
    }
  },[])



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
