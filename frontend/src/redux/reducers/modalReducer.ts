import {createSlice,PayloadAction} from '@reduxjs/toolkit'


export enum AvailableWindows{
    "Register"="Register",
    "Login"="Login",
}
export interface IModal {
    showModal : boolean
    showWindow : AvailableWindows | null
}


const defaultState : IModal = {
    showModal : false,
    showWindow : null
}

export const modalSlice = createSlice({
    name : 'modal',
    initialState : defaultState,
    reducers : {
        showModalLogin(state : IModal){
            state.showModal = true
            state.showWindow = AvailableWindows.Login
        },
        showModalRegister(state : IModal){
            state.showModal = true
            state.showWindow = AvailableWindows.Register
        },
        closeModalWindow(state : IModal){
            state.showModal = false
            state.showWindow = null
        }
    }
})