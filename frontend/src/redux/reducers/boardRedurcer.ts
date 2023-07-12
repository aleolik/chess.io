import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { Board } from '../../chess-logic/models/Board'
import {Draft} from "immer"
import { Colors } from '../../chess-logic/models/Colors'
import { Cell } from '../../chess-logic/models/Cell'
import { Figure } from '../../chess-logic/models/Figure'

interface IBoardState{
    board : Board | null
    currentMove : Colors
    whiteTakenFigures : Figure[]
    blackTakenFigures : Figure[]
}

const defaultState : IBoardState = {
    board : null,
    currentMove : Colors.WHITE,
    whiteTakenFigures : [],
    blackTakenFigures : [],
}

export const boardSlice = createSlice({
    name : 'board',
    initialState : defaultState,
    reducers : {
        initNewBoard(state:Draft<IBoardState>,action:PayloadAction<boolean>){
           const newBoard = new Board(action.payload === true)
           newBoard.initCells()
           newBoard.addFigures()
           state.board = newBoard
        },
        updateBoard(state:Draft<IBoardState>,action:PayloadAction<Board>){
            state.board = action.payload
         },
        updateCells(state:Draft<IBoardState>,action:PayloadAction<Cell[][]>){
        if (state.board) {
            state.board.cells = action.payload
        }
        },
        changeCurrentMove(state:Draft<IBoardState>,action:PayloadAction<Colors>){
        state.currentMove = action.payload
        },
        addBlackTakenFigure(state:Draft<IBoardState>,action:PayloadAction<Figure>){
            state.blackTakenFigures = [...state.blackTakenFigures,action.payload]
        },
        addWhiteTakenFigure(state:Draft<IBoardState>,action:PayloadAction<Figure>){
            state.whiteTakenFigures = [...state.whiteTakenFigures,action.payload]
        }
        
    }
})