import {combineReducers,configureStore} from '@reduxjs/toolkit'
import { userSlice } from '../reducers/userReducer'
import { modalSlice } from '../reducers/modalReducer'

const RootRedcuer = combineReducers({
    user : userSlice.reducer,
    modal : modalSlice.reducer
})

export const SetupStore = () => {
    return configureStore({
        reducer : RootRedcuer,
        middleware: getDefaultMiddleware => getDefaultMiddleware({
            serializableCheck: false
        })
    })
}

export type RootState = ReturnType<typeof RootRedcuer>
export type AppStore = ReturnType<typeof SetupStore>
export type AppDispatch = AppStore['dispatch']