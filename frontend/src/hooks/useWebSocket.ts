import {useEffect, useState } from 'react'
import {SocketMethods} from '../interfaces/SocketMethods'
import {useNavigate} from 'react-router-dom'
import { IUser } from '../interfaces/IUser'
import { useAppSelector } from '../redux/hooks/useAppSelector'
import webSocketUrl from '../axios/webSocketInstance'
import { userSlice } from '../redux/reducers/userReducer'
import { useAppDispatch } from '../redux/hooks/useAppDispatch'




export const useWebSocket = (setUserOpponent : (userOpponent : null | IUser) => void) : [null | WebSocket,(socket : null | WebSocket) => void] => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate()
    const [socket,setSocket] = useState<WebSocket | null>(null)
    const dispatch = useAppDispatch()
    useEffect(() => {
        try {
            if (user) {
                const newSocket = new WebSocket(webSocketUrl)
                newSocket.onopen = () => {
                    // websocket.id will be the same as user.id
                    newSocket.send(JSON.stringify({
                        method : SocketMethods.connection,
                        user : user,
                    }))           
                    newSocket.onmessage = (event : MessageEvent<any>) => {
                        const data = JSON.parse(event.data)
                        switch (data.method) {
                            case SocketMethods.connection:
                                break;
                            case SocketMethods.startQueue:
                                break;
                            case SocketMethods.endQueue:
                                break;
                            case SocketMethods.getLobby:
                                const lobbyId = data.lobbyId
                                // give user as websocket
                                const userOpponent = data.user as IUser
                                setUserOpponent(userOpponent)
                                navigate(`multi-player/${lobbyId}`)
                                break;
                            default:
                                break
                        }
                    }
                    setSocket(newSocket)
                }
            }     
        } catch (e) {
            console.error('Connection to WSS failed')
            setSocket(null)
        }
        
    },[user])

    return [socket,setSocket]

}

