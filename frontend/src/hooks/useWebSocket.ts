import {useEffect, useState } from 'react'
import {IGameData, IGameDataBackend, SocketMethods} from '../interfaces/ws_interfaces'
import {useNavigate} from 'react-router-dom'
import { IUser } from '../interfaces/IUser'
import { useAppSelector } from '../redux/hooks/useAppSelector'
import webSocketUrl from '../axios/webSocketInstance'
import { useAppDispatch } from '../redux/hooks/useAppDispatch'
import { webSocketSlice } from '../redux/reducers/webSocketReducer'
import { Colors } from '../chess-logic/models/Colors'
import { boardSlice } from '../redux/reducers/boardRedurcer'
import { Cell } from '../chess-logic/models/Cell'
import { Figure, FigureNames } from '../chess-logic/models/Figure'
import { createFigureByProperties } from '../utils/createFigureByProperties'
import { parseCells } from '../utils/parseCells'




export const useWebSocket = ()  : void => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate()
    const {connection,startQueue,endQueue,setUser,resetSocket,startGame}  = webSocketSlice.actions
    const dispatch = useAppDispatch()
    const {updateCells,changeCurrentMove,addBlackTakenFigure,addWhiteTakenFigure,initNewBoard,setTakenFigures} = boardSlice.actions
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
                        switch (data.method) {
                            case SocketMethods.connection:
                                if (data?.gameData) {
                                    const gameData = data.gameData as IGameDataBackend
                                    dispatch(startGame({
                                        gameActive : gameData.gameActive,
                                        currentMove : gameData.currentMove,
                                        lobbyId : gameData.lobbyId,
                                        userColor : gameData.userColor,
                                        enemyUser : gameData.enemyUser,
                                        clientTimer : gameData.clientTimer,
                                        enemyClientTimer : gameData.enemyClientTimer,
                                        winner : gameData.winner
                                    }))
                                    dispatch(initNewBoard())
                                    dispatch(updateCells(parseCells(gameData.boardCells)))
                                    // transform taken figures to object instances
                                    const whiteTakenFigures : Array<Figure> = []
                                    const blackTakenFigures : Array<Figure> = []
                                    for (let figure of gameData.takenFigures){
                                        const newFigure = createFigureByProperties(figure.name,figure.color)
                                        if (newFigure) {
                                            if (newFigure.color === Colors.WHITE) {
                                                whiteTakenFigures.push(newFigure)
                                            } else {
                                                blackTakenFigures.push(newFigure)
                                            }
                                        }
                                    }
                                    
                                    if (whiteTakenFigures.length) {
                                        dispatch(setTakenFigures({takenFigures:whiteTakenFigures,color:Colors.WHITE}))
                                    }
                                    if (blackTakenFigures.length) {
                                        dispatch(setTakenFigures({takenFigures:blackTakenFigures,color:Colors.BLACK}))
                                    }
                                }
                                dispatch(setUser(user))
                                break;
                            case SocketMethods.startQueue:
                                dispatch(startQueue())
                                break;
                            case SocketMethods.endQueue:
                                dispatch(endQueue())
                                break;
                            case SocketMethods.getLobby:
                                const gameDataFromWs = data.gameData as IGameData
                                // gameDataFromWs.boardCells = parseCells(gameDataFromWs.boardCells)
                                dispatch(startGame(gameDataFromWs))
                                dispatch(initNewBoard())
                                navigate(`multi-player/${gameDataFromWs.lobbyId}`)  
                                break;
                            case SocketMethods.updateBoardState:
                                 dispatch(updateCells(parseCells(data.updatedBoardCells as Cell[][])))
                                 dispatch(changeCurrentMove(data.currentMove as Colors))
                                break;
                            case SocketMethods.updateTakenFiguresState:
                                /*
                                  after JSON.parse() and JSON.stringfity() all methods of objects are erased,
                                  so you need to regive it again
                                */
                                const takenFigureThisMove =  data.takenFigureThisMove as {name : FigureNames,color:Colors,id:string}
                                const figureInstance = createFigureByProperties(takenFigureThisMove.name,takenFigureThisMove.color)
                                if (figureInstance) {
                                    if (figureInstance.color === Colors.BLACK) {
                                        dispatch(addBlackTakenFigure(figureInstance))
                                    } else {
                                        dispatch(addWhiteTakenFigure(figureInstance))
                                    }
                                }
                                break;
                            default:
                                break
                        }
                    }
                    newWebSocket.onclose = (event : CloseEvent) => {
                        // delete active websocket from WSS(websocket server)
                        dispatch(resetSocket())
                    }
                    dispatch(connection(newWebSocket))
                } 
            } catch (e) {
                console.error('Connection to WSS failed')
                dispatch(resetSocket())
            }
        } else {
            dispatch(resetSocket())
        }
        
        
    },[user])

}

