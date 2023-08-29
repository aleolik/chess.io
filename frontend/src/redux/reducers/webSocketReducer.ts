import {createSlice,Draft,PayloadAction} from '@reduxjs/toolkit'
import { IGameData, IWebSocketState } from '../../interfaces/ws_interfaces'
import { IUser } from '../../interfaces/IUser'
import { Colors } from '../../chess-logic/models/Colors'
import { Cell } from '../../chess-logic/models/Cell'
import { Board } from '../../chess-logic/models/Board'
import { Figure } from '../../chess-logic/models/Figure'




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
        connection(state:Draft<IWebSocketState>,action:PayloadAction<WebSocket>){
           state.ws = action.payload
        },
        resetSocket(state:Draft<IWebSocketState>){
            state.id = null
            state.gameData = null
            state.ws = null
            state.user = null
            state.inQueue = false
        },
        startQueue(state:Draft<IWebSocketState>){
            // start queue if user not in the game
            if (state.gameData === null || (state.gameData && state.gameData.gameActive === false)) {
                state.inQueue = true
            }
        },
        endQueue(state:Draft<IWebSocketState>){
            state.inQueue = false
        },
        startGame(state:Draft<IWebSocketState>,action:PayloadAction<Draft<IGameData>>){
            state.gameData = action.payload
            state.inQueue = false
        },
        clearGameData(state:Draft<IWebSocketState>){
            state.gameData =  null
        },
        endGame(state:Draft<IWebSocketState>,action:PayloadAction<Colors | null>){
            if (state.gameData) {
                state.gameData.gameActive = false
                // when tie or game isActive then winner === null,otherwise color of the winner
                state.gameData.winner = action.payload
            }
        },
        setUser(state:Draft<IWebSocketState>,action:PayloadAction<IUser>){
            state.user = action.payload
            state.id = action.payload.id.toString()
        },
        initializeNewBoard(state:Draft<IWebSocketState>){
            if (state.gameData && state.gameData.gameActive) {
                const newBoard = new Board()
                newBoard.initCells()
                newBoard.addFigures()
                state.gameData.board = newBoard
            }
         },
         updateBoardForRender(state:Draft<IWebSocketState>,action:PayloadAction<Board>){
            if (state.gameData) {
                state.gameData.board = action.payload
            }
          },
         updateCellsInExistingBoard(state:Draft<IWebSocketState>,action:PayloadAction<Cell[][]>){
             if (state.gameData && state.gameData.board) {
                 state.gameData.board.cells = action.payload
             }
         },
         changeCurrentMove(state:Draft<IWebSocketState>,action:PayloadAction<Colors>){
             if (state.gameData && state.gameData.gameActive) {
                state.gameData.currentMove = action.payload
             }
         },
         addTakenFigure(state:Draft<IWebSocketState>,action:PayloadAction<Draft<Figure>>){
            if (state.gameData && state.gameData.gameActive) {
                if (action.payload.color === Colors.WHITE) {
                    state.gameData.whiteTakenFigures.push(action.payload)
                } else {
                    state.gameData.blackTakenFigures.push(action.payload)
                }
            }   
         },
         setTakenFigures(state:Draft<IWebSocketState>,action:PayloadAction<{takenFigures : Array<Figure>,color:Colors}>){
            if (state.gameData && state.gameData.gameActive) {
                if (action.payload.color === Colors.BLACK) {
                    state.gameData.blackTakenFigures = action.payload.takenFigures
                } else {
                    state.gameData.whiteTakenFigures = action.payload.takenFigures
                }
            }
         },
         highlightCells(state:Draft<IWebSocketState>,action:PayloadAction<Cell>){
            if (state.gameData && state.gameData.gameActive && state.gameData.board) {
                state.gameData.board.cells = state.gameData.board.highlightCells(action.payload)
            }
         },
         updateGameDataAftetMove(state:Draft<IWebSocketState>,action:PayloadAction<{currentMove:Colors,blackTakenFigures:Figure[],whiteTakenFigures:Figure[]}>) {
            if (state.gameData && state.gameData.board) {
                state.gameData.currentMove = action.payload.currentMove
                state.gameData.whiteTakenFigures = action.payload.whiteTakenFigures
                state.gameData.blackTakenFigures = action.payload.blackTakenFigures
            }
         },
         updateTimeForClient(state:Draft<IWebSocketState>,action:PayloadAction<{clientTime:number,enemyClientTime:number}>){
            if (state.gameData) {
                state.gameData.clientTime = action.payload.clientTime
                state.gameData.enemyClientTime = action.payload.enemyClientTime
            }
         }
    }
})

