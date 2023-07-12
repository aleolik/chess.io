import {useEffect, useState } from 'react'
import {SocketMethods} from '../interfaces/ws_interfaces'
import {useNavigate} from 'react-router-dom'
import { IUser } from '../interfaces/IUser'
import { useAppSelector } from '../redux/hooks/useAppSelector'
import webSocketUrl from '../axios/webSocketInstance'
import { useAppDispatch } from '../redux/hooks/useAppDispatch'
import { IconBaseProps } from 'react-icons/lib'
import { webSocketSlice } from '../redux/reducers/webSocketReducer'
import { Colors } from '../chess-logic/models/Colors'
import { Board } from '../chess-logic/models/Board'
import { boardSlice } from '../redux/reducers/boardRedurcer'
import { Cell } from '../chess-logic/models/Cell'
import { Figure, FigureNames } from '../chess-logic/models/Figure'
import { Rook } from '../chess-logic/figures/Rook'
import { Pawn } from '../chess-logic/figures/Pawn'
import { Horse } from '../chess-logic/figures/Horse'
import { Bishop } from '../chess-logic/figures/Bishop'
import { King } from '../chess-logic/figures/King'
import { Queen } from '../chess-logic/figures/Queen'
import { createFigureByProperties } from '../utils/createFigureByProperties'




export const useWebSocket = ()  : void => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate()
    const {connection,startQueue,endQueue,setColor,setUser}  = webSocketSlice.actions
    const dispatch = useAppDispatch()
    const {updateCells,changeCurrentMove,addBlackTakenFigure,addWhiteTakenFigure} = boardSlice.actions
    useEffect(() => {
        if (user) {
            try {
                const newWebSocket = new WebSocket(webSocketUrl) as WebSocket
                newWebSocket.onopen = () => {
                    // websocket.id will be the same as user.id
                    newWebSocket.send(JSON.stringify({
                        method : SocketMethods.connection,
                        user : user,
                    }))           
                    newWebSocket.onmessage = (event : MessageEvent<any>) => {
                        const data : any = JSON.parse(event.data)
                        let ws : null | WebSocket = null
                        switch (data.method) {
                            case SocketMethods.connection:
                                dispatch(setUser(user))
                                break;
                            case SocketMethods.startQueue:
                                dispatch(startQueue())
                                break;
                            case SocketMethods.endQueue:
                                dispatch(endQueue())
                                break;
                            case SocketMethods.getLobby:
                                const lobbyId = data.lobbyId as string
                                const userColor = data.color as Colors
                                const enemyUser = data.enemyUser as {user:IUser,color:Colors}
                                dispatch(setColor(userColor))
                                navigate(`multi-player/${lobbyId}`,{state : {lobbyId:lobbyId,enemyUser:enemyUser}})  
                                break;
                            case SocketMethods.makeMove:
                                const cells = data.cells as Cell[][]
                                /*
                                  after JSON.parse() and JSON.stringfity() all methods of objects are erased,
                                  so you need to regive it again
                                */
                                for (let i = 0;i<cells.length;i++){
                                    for (let j = 0;j<cells.length;j++){
                                        let figure : Figure | null = null
                                        const currentCell = cells[i][j]
                                        if (currentCell.figure){
                                            figure = createFigureByProperties(currentCell.figure.name,currentCell.figure.color)
                                        }
                                        cells[i][j] = new Cell(currentCell.i,currentCell.j,currentCell.color,figure)

                                    }
                                }
                                const currentMove = data.currentMove as Colors
                                const takenFigureThisMove = data.takenFigureThisMove as null | {id : string,color : Colors,name : FigureNames}
                                if (takenFigureThisMove) {
                                    const figure = createFigureByProperties(takenFigureThisMove.name,takenFigureThisMove.color)
                                    if (figure) {
                                        if (figure.color === Colors.BLACK) {
                                            dispatch(addBlackTakenFigure(figure))
                                        } else {
                                            dispatch(addWhiteTakenFigure(figure))
                                        }
                                    }
                                }
                                dispatch(updateCells(cells))
                                dispatch(changeCurrentMove(currentMove))
                                break;
                            default:
                                break
                        }
                    }
                    dispatch(connection(newWebSocket))
                }     
            } catch (e) {
                console.error('Connection to WSS failed')
                dispatch(connection(null))
            }
        } else {
            dispatch(connection(null))
        }
        
        
    },[user])

}

