import {createSlice,PayloadAction} from '@reduxjs/toolkit'


export interface IUser {
    id : string,
    username : string,
    email : string,
    img : string | null,
    roles : string[]
}


export interface userState {
    user : IUser | null,
    error : string,
    load : boolean,
}

const defaultState : userState = {
    user : null,
    error : '',
    load : false,
}

export const userSlice = createSlice({
    name : 'user',
    initialState : defaultState,
    reducers : {
        startLoad(state:userState){
            state.user = null
            state.error = ''
            state.load = true
        },
        errorLoad(state:userState,action:PayloadAction<string>){
            state.user = null
            state.error = action.payload
            state.load = false
        },
        userLoad(state:userState,action:PayloadAction<IUser>){
            state.user = action.payload
            state.error = ''
            state.load = false
        },
        logout(state:userState){
            state.error = ''
            state.user = null
            state.load = false
        }
    }
})