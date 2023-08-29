import {useEffect, useState } from 'react'
import {IGameData, SocketMethods} from '../interfaces/ws_interfaces'
import {useNavigate} from 'react-router-dom'
import { useAppSelector } from '../redux/hooks/useAppSelector'
import { useAppDispatch } from '../redux/hooks/useAppDispatch'
import { webSocketSlice } from '../redux/reducers/webSocketReducer'
import { Colors } from '../chess-logic/models/Colors'
import { Cell } from '../chess-logic/models/Cell'
import { Figure, FigureNames } from '../chess-logic/models/Figure'
import { createFigureByProperties } from '../utils/createFigureByProperties'
import { parseCells } from '../utils/parseCells'
import { parseFigures } from '../utils/parseFigures'
import { modalSlice } from '../redux/reducers/modalReducer'
import { userSlice } from '../redux/reducers/userReducer'

export enum endGameStatuses{
    TIME="TIME",
    MATE="MATE",
}



export const useWebSocket = ()  : void => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate()
    const {connection,startQueue,endQueue,setUser,resetSocket,startGame,initializeNewBoard,updateCellsInExistingBoard,setTakenFigures,updateGameDataAftetMove,endGame,updateTimeForClient}  = webSocketSlice.actions
    const ws = useAppSelector(state => state.webSocket.ws)
    const showGameStauts = modalSlice.actions.showGameStatus
    const logout = userSlice.actions.logout
    const dispatch = useAppDispatch()
    const webSocketUrl = "ws://localhost:5000"
    useEffect(() => {
        if (user && !ws) {
            console.log("tring...",user,ws)
            try {
                const newWebSocket = new WebSocket(webSocketUrl) as WebSocket
                newWebSocket.onopen = () => {
                    // websocket.id will be the same as user.id
                    newWebSocket.send(JSON.stringify({
                        method : SocketMethods.connection,
                        user : user,
                    }))           
                    newWebSocket.onmessage = (event : MessageEvent<any>) => {
                        const data : {method : string,[key : string] : unknown} = JSON.parse(event.data)
                        if (data.method !== SocketMethods.updateTimeState) {
                            console.log("method",data.method)
                            console.log("data",data)
                        }
                        switch (data.method) {
                            case SocketMethods.connection:
                                dispatch(setUser(user))
                                const inQueue = data.inQueue
                                if (data?.gameData) {
                                    const gameData = data.gameData as IGameData
                                    // TODO : try to add if (user),then ...
                                    dispatch(startGame({
                                        ...gameData,
                                        clientTime : gameData.clientTime,
                                        enemyClientTime : gameData.enemyClientTime,
                                        board : null,
                                        blackTakenFigures : [],
                                        whiteTakenFigures : []
                                    }))
                                    dispatch(initializeNewBoard())
                                    if (gameData.gameActive && gameData.board) {
                                        // means game already started and user refreshed page,so re-render last state that saved in WSS.activeGames[ws.user.id]
                                        dispatch(updateCellsInExistingBoard(parseCells(gameData.board.cells)))
                                    }
                                    if (gameData.gameActive && (gameData.blackTakenFigures.length || gameData.whiteTakenFigures.length)) {
                                         // means game already started and user refreshed page,so re-render last state that saved in WSS.activeGames[ws.user.id]
                                         if (gameData.blackTakenFigures.length) {
                                            const tempArr = []
                                            for (let figure of gameData.blackTakenFigures){
                                                // add to every newFigure class methods,that were erased.
                                                const newFigure = createFigureByProperties(figure)
                                                if (newFigure) {
                                                    tempArr.push(newFigure)
                                                }
                                            } 
                                            dispatch(setTakenFigures({
                                                takenFigures : tempArr,
                                                color : Colors.BLACK
                                            }))
                                         }
                                         if (gameData.whiteTakenFigures.length) {
                                            const tempArr = []
                                            for (let figure of gameData.whiteTakenFigures){
                                                // add to every newFigure class methods,that were erased.
                                                const newFigure = createFigureByProperties(figure)
                                                if (newFigure) {
                                                    tempArr.push(newFigure)
                                                }
                                            } 
                                            dispatch(setTakenFigures({
                                                takenFigures : tempArr,
                                                color : Colors.WHITE
                                            }))
                                         }
                                    }
                                } else {
                                    if (inQueue) {
                                        dispatch(startQueue())
                                    }
                                }
                                break;
                            case SocketMethods.startQueue:
                                dispatch(startQueue())
                                break;
                            case SocketMethods.endQueue:
                                dispatch(endQueue())
                                break;
                            case SocketMethods.getLobby:
                                // user found a game,recive data and redirect him
                                if (data?.gameData) {
                                    const gameData = data.gameData as IGameData
                                    dispatch(startGame(gameData))
                                    dispatch(initializeNewBoard())
                                    navigate(`multi-player/${gameData.lobbyId}`)  
                                }
                                break;
                            case SocketMethods.updateGameState:
                                if (data?.gameData) {
                                    // enemy user made move,recive new data and give to client
                                    const gameData = data.gameData as {
                                        updatedBoardCells : Cell[][]
                                        ,blackTakenFigures : Figure[]
                                        ,whiteTakenFigures : Figure[]
                                        ,currentMove : Colors}
                                        if (gameData) {
                                            console.log("gamedata",gameData)
                                            // regive class methods for Cell's instances again
                                            dispatch(updateCellsInExistingBoard(parseCells(gameData.updatedBoardCells as Cell[][])))
                                            dispatch(updateGameDataAftetMove({
                                                currentMove : gameData.currentMove,
                                                whiteTakenFigures : parseFigures(gameData.whiteTakenFigures),// regive class methods for Figure's instances again
                                                blackTakenFigures : parseFigures(gameData.blackTakenFigures),// regive class methods for Figure's instances again
                                            }))
                                    }
                                }
                                break;
                            case SocketMethods.updateTimeState:
                                const {clientTime,enemyClientTime} = data
                                dispatch(updateTimeForClient({
                                    clientTime : clientTime as number,
                                    enemyClientTime : enemyClientTime as number,
                                }))
                                break;
                            case SocketMethods.endGame:
                                const colorWinner = data?.winnerColor as Colors | null
                                const status = data?.status as endGameStatuses // user won by mate or time

                                if (status === endGameStatuses.TIME) {
                                    const enemyClientTime = data.enemyClientTime as number
                                    const clientTime = data.clientTime as number
                                    if (clientTime !== undefined && enemyClientTime !== undefined) {
                                        dispatch(showGameStauts())
                                        dispatch(updateTimeForClient({clientTime:clientTime,
                                        enemyClientTime:enemyClientTime}))
                                        dispatch(endGame(colorWinner))
                                    }
                                } else if (status === endGameStatuses.MATE) {
                                    dispatch(showGameStauts())
                                    dispatch(endGame(colorWinner))
                                }
                                break;
                        }
                    }
                    newWebSocket.onclose = (event : CloseEvent) => {
                        console.log("closing")
                        dispatch(resetSocket())
                    }
                    dispatch(connection(newWebSocket))
                } 
            } catch (e) {
                dispatch(resetSocket())
                dispatch(logout()) 
            }
        }
        
        
    },[user])

}

