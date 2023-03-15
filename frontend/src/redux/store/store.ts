import {combineReducers,configureStore,getDefaultMiddleware} from '@reduxjs/toolkit'
import { userSlice } from '../reducers/userReducer'

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck : false
})


const rootReducer = combineReducers({
    user : userSlice.reducer
})

export const setupStore = () => {
    return configureStore({
        reducer : rootReducer,
        middleware : customizedMiddleware
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']