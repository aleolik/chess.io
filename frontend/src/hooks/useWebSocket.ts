import {useEffect, useState } from 'react'
import {IGameData, SocketMethods} from '../interfaces/ws_interfaces'
import {useNavigate} from 'react-router-dom'
import { useAppSelector } from '../redux/hooks/useAppSelector'
import webSocketUrl from '../axios/webSocketInstance'
import { useAppDispatch } from '../redux/hooks/useAppDispatch'
import { webSocketSlice } from '../redux/reducers/webSocketReducer'
import { Colors } from '../chess-logic/models/Colors'
import { Cell } from '../chess-logic/models/Cell'
import { Figure, FigureNames } from '../chess-logic/models/Figure'
import { createFigureByProperties } from '../utils/createFigureByProperties'
import { parseCells } from '../utils/parseCells'
import { parseFigures } from '../utils/parseFigures'
import { modalSlice } from '../redux/reducers/modalReducer'


interface IGameDataBackend extends IGameData {
    clientTime : number,
    enemyClientTime : number
}

export const useWebSocket = ()  : void => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate()
    const {connection,startQueue,endQueue,setUser,resetSocket,startGame,initializeNewBoard,updateCellsInExistingBoard,setTakenFigures,updateGameDataAftetMove,endGame}  = webSocketSlice.actions
    const ws = useAppSelector(state => state.webSocket.ws)
    const showGameStauts = modalSlice.actions.showGameStatus
    const dispatch = useAppDispatch()
    const gameDataState = useAppSelector(state => state.webSocket.gameData)
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
                        const data : {method : string,[key : string] : unknown} = JSON.parse(event.data)
                        switch (data.method) {
                            case SocketMethods.connection:
                                dispatch(setUser(user))
                                if (data?.gameData) {
                                    const gameData = data.gameData as IGameDataBackend
                                    console.log("connectiion data",gameData)
                                    // TODO : try to add if (user),then ...
                                    dispatch(startGame({
                                        ...gameData,
                                        clientTimer : {
                                            intervalId : null,
                                            time : gameData.clientTime
                                        },
                                        enemyClientTimer : {
                                            intervalId : null,
                                            time : gameData.enemyClientTime
                                        },
                                        board : null,
                                        blackTakenFigures : [],
                                        whiteTakenFigures : []
                                    }))
                                    dispatch(initializeNewBoard())
                                    if (gameData.gameActive && gameData.board) {
                                        // means game already started and user refreshed page,so re-render last state that saved in WSS.activeGames[ws.id]
                                        dispatch(updateCellsInExistingBoard(parseCells(gameData.board.cells)))
                                    }
                                    if (gameData.gameActive && (gameData.blackTakenFigures.length || gameData.whiteTakenFigures.length)) {
                                         // means game already started and user refreshed page,so re-render last state that saved in WSS.activeGames[ws.id]
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
                                    const gameData = data.gameData as IGameDataBackend
                                    dispatch(startGame({
                                        clientTimer : {
                                            intervalId : null,
                                            time : gameData.clientTime
                                        },
                                        enemyClientTimer : {
                                            intervalId : null,
                                            time : gameData.enemyClientTime
                                        },
                                        currentMove : gameData.currentMove,
                                        gameActive : gameData.gameActive,
                                        lobbyId : gameData.lobbyId,
                                        userColor : gameData.userColor,
                                        enemyUser : gameData.enemyUser,
                                        winner : null,
                                        board : null,
                                        whiteTakenFigures : [],
                                        blackTakenFigures : [],
                                    }))
                                    dispatch(initializeNewBoard())
                                    navigate(`multi-player/${gameData.lobbyId}`)  
                                }
                                break;
                            case SocketMethods.updateGameState:
                                if (data?.gameData) {
                                    // enemy user made move,recive new data and give to client
                                    const gameData = data.gameData as {gameActive : boolean
                                        ,updatedBoardCells : Cell[][]
                                        ,blackTakenFigures : Figure[]
                                        ,whiteTakenFigures : Figure[]
                                        ,clientTime : number
                                        ,enemyClientTime : number
                                        ,currentMove : Colors}
                                        if (gameData) {
                                            // regive class methods for Cell's instances again
                                            dispatch(updateCellsInExistingBoard(parseCells(gameData.updatedBoardCells as Cell[][])))
                                            // regive class methods for Figure's instances again
                                            gameData.blackTakenFigures = parseFigures(gameData.blackTakenFigures)
                                            gameData.whiteTakenFigures = parseFigures(gameData.whiteTakenFigures)
                                            dispatch(updateGameDataAftetMove({
                                                currentMove : gameData.currentMove,
                                                clientTime : gameData.clientTime,
                                                enemyClientTime : gameData.enemyClientTime,
                                                whiteTakenFigures : gameData.whiteTakenFigures,
                                                blackTakenFigures : gameData.blackTakenFigures,
                                            }))
                                    }
                                }
                                break;
                            case SocketMethods.endGame:
                                const colorWinner = data.winnerColor as Colors | null
                                dispatch(showGameStauts())
                                dispatch(endGame(colorWinner))
                                break;
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
                if (ws) {
                    ws.close()
                }
                dispatch(resetSocket())
            }
        } else {
            if (ws) {
                ws.close()
            }
            dispatch(resetSocket())
        }
        
        
    },[user])

}

