import React, { useEffect, useRef } from 'react'
import scss from './MainPage.module.scss'
import backgroundImg from '../../assets/background.png'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import { SocketMethods } from '../../interfaces/ws_interfaces'
import Loader from '../../components/ReactComponents/Loader/Loader'
import { AiOutlineClose } from 'react-icons/ai'


const MainPage = () => {

  const navigate = useNavigate()
  const {user} = useAppSelector(state => state.user)
 
  const {ws,inQueue,gameData} = useAppSelector(state => state.webSocket)

  const startQueue = (event : React.MouseEvent<HTMLButtonElement>) => {
    if (ws && user) {
        ws.send(JSON.stringify({
            method : SocketMethods.startQueue,
            id : user.id,
        }))
    }
  }

  const cancelQueue = () => {
    if (ws && user) {
        ws.send(JSON.stringify({
            method : SocketMethods.endQueue,
        }))
    
    }
  }

  return (
    <div>
        <div>
                <div className={scss.container}>
                    <img src={backgroundImg} alt='bg' className={scss.bgImg}></img>
                    <div className={scss.buttonContainer}>
                        {inQueue && (
                            <div className={scss.textContainer}>
                                <h4>Looking for an opponent...</h4>
                                <AiOutlineClose onClick={cancelQueue} className={scss.closeIcon}/>
                                <Loader/>
                            </div>
                        )}
                        {gameData?.gameActive && (
                            <>
                                <h4>You are currently in game</h4>
                                <button onClick={() => navigate(`/multi-player/${gameData.lobbyId}`)} className={scss.buttonPlay}>Back</button>
                            </>
                        )}
                        <button onClick={() => navigate('/single-player')} disabled={gameData?.gameActive || inQueue} className={scss.containerButton}>Play on 1 device</button>
                        <button disabled={!ws || !user || inQueue || gameData?.gameActive} onClick={startQueue} className={scss.containerButton}>Play Multiplayer</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default MainPage