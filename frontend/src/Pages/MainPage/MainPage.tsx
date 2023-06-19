import React,{useEffect, useState} from 'react'
import {isMobile } from 'react-device-detect'
import scss from './MainPage.module.scss'
import BottomMenu from '../../components/ReactComponents/BottomMenu/BottomMenu'
import backgroundImg from '../../assets/background.png'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '../../hooks/useWebSocket'
import { IUser } from '../../interfaces/IUser'
import { userSlice } from '../../redux/reducers/userReducer'
import { SocketMethods } from '../../interfaces/SocketMethods'
const MainPage = () => {
  const navigate = useNavigate()
  const {user} = useAppSelector(state => state.user)
  const [userOpponent,setUserOpponent]  = useState<null | IUser>(null)
  const [webSocket,setWebSocket] = useWebSocket(setUserOpponent)

  const startQueue = (event : React.MouseEvent<HTMLButtonElement>) => {
    console.log(webSocket)
    if (webSocket && user) {
        webSocket.send(JSON.stringify({
            method : SocketMethods.startQueue,
            id : user.id,
          }))
    } else {
        toast.error('to play with other users,you need to be logged in!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }
  }
  return (
    <div>
        <div>
            <ToastContainer></ToastContainer>
            {!isMobile && (
                <div className={scss.container}>
                    <div className={scss.firstContainer}>
                        <img src={backgroundImg} alt='bg' className={scss.bgImg}></img>
                        <button onClick={() => navigate('/single-player')} className={[`btn btn-primary`,scss.buttonPlay].join(' ')}>Play on 1 device</button>
                        <button disabled={!webSocket || !user} onClick={startQueue} className={[`btn btn-primary`,scss.buttonPlay].join(' ')}>Play Multiplayer</button>
                    </div>
                </div>
            )}
            <BottomMenu/>
        </div>
    </div>
  )
}

export default MainPage