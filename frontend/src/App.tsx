import { useEffect } from 'react';
import MainPage from './Pages/MainPage/MainPage';
import { Routes,Route } from 'react-router-dom';
import Layout from './components/ReactComponents/Layout/Layout';
import SinglePlayerBoardPage from './Pages/singlePlayerBoard/singlePlayerBoard';
import MultiPlayerBoard from './Pages/MultiPlayerBoard/MultiPlayerBoard';
import { useAppSelector } from './redux/hooks/useAppSelector';
import { AvailableWindows, modalSlice } from './redux/reducers/modalReducer';
import RegisterForm from './components/ReactComponents/RegisterForm/RegisterForm';
import LoginForm from './components/ReactComponents/LoginForm/LoginForm';
import ModalWindow from './components/ReactComponents/ModalWindow/ModalWindow';
import { IUser } from './interfaces/IUser';
import jwtDecode from 'jwt-decode';
import { userSlice } from './redux/reducers/userReducer';
import { useAppDispatch } from './redux/hooks/useAppDispatch';
import userInstance from './axios/userInstance';
import { useWebSocket } from './hooks/useWebSocket';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import AuthPage from './Pages/AuthPage/AuthPage';
import HistoryPage from './Pages/HistoryPage/HistoryPage';

function App() {
  const {showModal,showWindow} = useAppSelector(state => state.modal)
  const closeModalWindow = modalSlice.actions.closeModalWindow
  const {userLoad,startLoad,finishLoad} = userSlice.actions
  const dispatch = useAppDispatch()
  useEffect(() => {
    const url = "/user/auth"
    dispatch(startLoad())
    userInstance.get(url).then((res) => {
      const token = res.data.token 
      const user = jwtDecode(token) as IUser
      dispatch(userLoad(user))
      if (showModal && (showWindow === AvailableWindows.Register || showWindow === AvailableWindows.Login)) {
        dispatch(closeModalWindow())
      }
    }).catch((err) => {
      console.error("Failed to login user!")
    }).finally(() => {
      dispatch(finishLoad())
    })
  },[])
  useWebSocket()



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
            <Route element={
              <AuthPage>
                 <MultiPlayerBoard/>
              </AuthPage>
            } path='/multi-player/:id'></Route>
            <Route path='/user-history' element={<HistoryPage/>}></Route>
            <Route path="*" element={<NotFoundPage/>} />
          </Route>
        </Routes>
    </>
  );
}

export default App;
