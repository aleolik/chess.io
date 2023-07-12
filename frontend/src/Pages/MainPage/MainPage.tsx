import React, { useEffect } from 'react'
import {isMobile } from 'react-device-detect'
import scss from './MainPage.module.scss'
import BottomMenu from '../../components/ReactComponents/BottomMenu/BottomMenu'
import backgroundImg from '../../assets/background.png'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { SocketMethods } from '../../interfaces/ws_interfaces'
const MainPage = () => {
  const navigate = useNavigate()
  const {user} = useAppSelector(state => state.user)
 
  const ws = useAppSelector(state => state.webSocket.ws)

  const startQueue = (event : React.MouseEvent<HTMLButtonElement>) => {
    if (ws && user) {
        ws.send(JSON.stringify({
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
                        <button disabled={!ws || !user} onClick={startQueue} className={[`btn btn-primary`,scss.buttonPlay].join(' ')}>Play Multiplayer</button>
                    </div>
                </div>
            )}
            <BottomMenu/>
        </div>
    </div>
  )
}

export default MainPage