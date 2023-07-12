import {combineReducers,configureStore} from '@reduxjs/toolkit'
import { userSlice } from '../reducers/userReducer'
import { modalSlice } from '../reducers/modalReducer'
import {webSocketSlice} from '../reducers/webSocketReducer'
import { boardSlice } from '../reducers/boardRedurcer'

const RootRedcuer = combineReducers({
    user : userSlice.reducer,
    modal : modalSlice.reducer,
    webSocket : webSocketSlice.reducer,
    board : boardSlice.reducer,
})

const SetupStore = () => {
    return configureStore({
        reducer : RootRedcuer,
        middleware: getDefaultMiddleware => getDefaultMiddleware({
            serializableCheck: false
        })
    })
}

export const store = SetupStore()

export type RootState = ReturnType<typeof RootRedcuer>
export type AppStore = ReturnType<typeof SetupStore>
export type AppDispatch = AppStore['dispatch']