import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { IWebSocketState } from '../../interfaces/ws_interfaces'
import { IUser } from '../../interfaces/IUser'
import { Colors } from '../../chess-logic/models/Colors'


const defaultState : IWebSocketState = {
    id : null,
    inQueue : false,
    user : null,
    color : null,
    ws : null,
}

export const webSocketSlice = createSlice({
    name : 'webSocket',
    initialState : defaultState,
    reducers : {
        connection(state:IWebSocketState,action:PayloadAction<WebSocket | null>){
           state.ws = action.payload
        },
        startQueue(state:IWebSocketState){
            state.inQueue = true
        },
        endQueue(state:IWebSocketState){
            state.inQueue = false
        },
        setColor(state:IWebSocketState,action:PayloadAction<Colors>){
            state.color = action.payload
        },
        setUser(state:IWebSocketState,action:PayloadAction<IUser>){
            state.user = action.payload
            state.id = action.payload.id.toString()
        },
    }
})

