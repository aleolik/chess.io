import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { IGameData, IWebSocketState } from '../../interfaces/ws_interfaces'
import { IUser } from '../../interfaces/IUser'
import { ITimer } from '../../components/ChessComponents/MultiPlayerBoardComponent/MultiPlayerBoardComponent'
import { act } from 'react-dom/test-utils'
import { Colors } from '../../chess-logic/models/Colors'
import { PlayFunction } from 'use-sound/dist/types'


export interface ITimerWithType extends ITimer{
    timerType : "client" | "enemyClient"
}

const defaultState : IWebSocketState = {
    id : null,
    inQueue : false,
    user : null,
    gameData : null,
    ws : null,

}

export const webSocketSlice = createSlice({
    name : 'webSocket',
    initialState : defaultState,
    reducers : {
        connection(state:IWebSocketState,action:PayloadAction<WebSocket>){
           state.ws = action.payload
        },
        resetSocket(state:IWebSocketState){
            state.id = null
            state.gameData = null
            state.ws = null
            state.user = null
            state.inQueue = false
        },
        startQueue(state:IWebSocketState){
            // start queue if user not in the game
            if (state.gameData === null || (state.gameData && state.gameData.gameActive === false)) {
                state.inQueue = true
            }
        },
        endQueue(state:IWebSocketState){
            state.inQueue = false
        },
        startGame(state:IWebSocketState,action:PayloadAction<IGameData>){
            state.gameData = action.payload
            state.inQueue = false
        },
        endGame(state:IWebSocketState,action:PayloadAction<Colors | null>){
            if (state.gameData) {
                state.gameData.gameActive = false
                // when tie or game isActive then winner === null,otherwise color of the winner
                state.gameData.winner = action.payload
            }
        },
        cleanGame(state:IWebSocketState){
            state.gameData = null
        },
        activateTimer(state:IWebSocketState,action:PayloadAction<ITimerWithType>){
            if (state.gameData && action.payload.intervalId === null) {
                if (action.payload.timerType === 'client'){
                    if (state.gameData.clientTimer.time > 0) {
                        state.gameData.clientTimer.time -= 1
                    }
                } else {
                    if (state.gameData.enemyClientTimer.time > 0) {
                        state.gameData.enemyClientTimer.time -= 1
                    }
                }
            }
        },
        deactivateTimer(state:IWebSocketState,action:PayloadAction<ITimerWithType>){
            if (state.gameData && action.payload.intervalId !== null) {
                clearInterval(action.payload.intervalId)
                if (action.payload.timerType === 'client'){
                    state.gameData.clientTimer.intervalId = null
                } else {
                    state.gameData.enemyClientTimer.intervalId = null
                }
            }
        },
        setIntervalIdForTimer(state:IWebSocketState,action:PayloadAction<{timerType : "client" | "enemyClient",intervalId : ReturnType<typeof setInterval> | null}>){
            if (state.gameData && state.gameData.gameActive) {
                if (action.payload.timerType === 'client'){
                    state.gameData.clientTimer.intervalId = action.payload.intervalId
                } else {
                    state.gameData.enemyClientTimer.intervalId = action.payload.intervalId
                }
            }
        },
        setUser(state:IWebSocketState,action:PayloadAction<IUser>){
            state.user = action.payload
            state.id = action.payload.id.toString()
        },
    }
})

