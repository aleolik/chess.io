import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { IUser, userState } from '../../interfaces/IUser'


const defaultState : userState = {
    user : null,
    userOnError : '',
    userOnLoad : false,
}

export const userSlice = createSlice({
    name : 'user',
    initialState : defaultState,
    reducers : {
        startLoad(state:userState){
            state.user = null
            state.userOnError = ''
            state.userOnLoad = true
        },
        errorLoad(state:userState,action:PayloadAction<string>){
            state.user = null
            state.userOnError = action.payload
            state.userOnLoad = false
        },
        userLoad(state:userState,action:PayloadAction<IUser>){
            state.user = action.payload
            state.userOnError = ''
            state.userOnLoad = false
        },
        logout(state:userState){
            state.userOnError = ''
            state.user = null
            state.userOnLoad = false
        }
    }
})

