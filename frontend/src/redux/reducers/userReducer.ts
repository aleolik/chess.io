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
    loading : boolean,
}

const defaultState : userState = {
    user : null,
    error : '',
    loading : false
}

export const userSlice = createSlice({
    name : 'user',
    initialState : defaultState,
    reducers : {
        startLoad(state:userState){
            state.user = null
            state.error = ''
            state.loading = true
        },
        errorLoad(state:userState,action:PayloadAction<string>){
            state.user = null
            state.error = action.payload
            state.loading = false
        },
        userLoad(state:userState,action:PayloadAction<IUser>){
            state.user = action.payload
            state.error = ''
            state.loading = false
        }
    }
})