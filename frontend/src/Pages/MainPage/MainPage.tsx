import React, { useEffect, useRef, useState } from 'react'
import scss from './MainPage.module.scss'
import backgroundImg from '../../assets/background.png'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks/useAppSelector'
import { SocketMethods } from '../../interfaces/ws_interfaces'
import Loader from '../../components/ReactComponents/Loader/Loader'
import { AiOutlineClose } from 'react-icons/ai'
import userInstance from '../../axios/userInstance'
import jwtDecode from 'jwt-decode'
import { IUser } from '../../interfaces/IUser'
import { AxiosError } from 'axios'
import { userSlice } from '../../redux/reducers/userReducer'
import { useAppDispatch } from '../../redux/hooks/useAppDispatch'


const MainPage = () => {
  const [errMsg,setErrMsg] = useState<string>("")
  const navigate = useNavigate()
  const {user} = useAppSelector(state => state.user)
  const {ws,inQueue,gameData} = useAppSelector(state => state.webSocket)
  const userLoad  = userSlice.actions.userLoad
  const dispatch = useAppDispatch()

  const startQueue = async(event : React.MouseEvent<HTMLButtonElement>) => {
    // check auth,then start queue
    try {
        const res = await userInstance.get("/user/auth")
        const token = res.data.token 
        const decodedUser = jwtDecode(token) as IUser
        dispatch(userLoad(decodedUser))
        if (ws && decodedUser) {
            console.log("socket starting queue")
            ws.send(JSON.stringify({
                method : SocketMethods.startQueue,
                id : decodedUser.id,
            }))
        }
    } catch (err) {
        const axiosErr = err as AxiosError
        console.error(axiosErr)
        if (axiosErr.message) {
            setErrMsg(axiosErr.message)
        } else {
            setErrMsg('unknown error!')
        }
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
                        {errMsg && (
                            <h1 className={scss.errText}>{errMsg}</h1>
                        )}
                         {user && (
                            <h1 className={scss.text}>Logined as {user.email}</h1>
                        )}
                        {gameData?.gameActive  && ws && (
                            <>
                                <h4>You are currently in game</h4>
                                <button onClick={() => navigate(`/multi-player/${gameData.lobbyId}`)} className={scss.buttonPlay}>Back</button>
                            </>
                        )}
                        <button onClick={() => navigate('/single-player')} disabled={gameData?.gameActive || inQueue} className={scss.containerButton}>Play on 1 device</button>
                        {!user && (
                            <h1 className={scss.text}>You need to login to play multiplayer</h1>
                        )}
                        {user && !ws && (
                             <h1 className={scss.text}>Connection to webSocket closed,refresh the page,please</h1>
                        )}

                        <button disabled={!ws || !user || inQueue || gameData?.gameActive} onClick={startQueue} className={scss.containerButton}>Play Multiplayer</button>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default MainPage

