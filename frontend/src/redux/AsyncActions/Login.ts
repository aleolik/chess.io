import { userSlice } from "../reducers/userReducer"
import {IUser} from '../../interfaces/IUser'
import jwtDecode from "jwt-decode"
import { AxiosError, AxiosResponse } from "axios"
import { AppDispatch } from "../store/store"
import axiosPublic from '../../axios/publicInstance'

export const LoginUserAction = (email:string,password:string) => {

    const {startLoad,errorLoad,userLoad} = userSlice.actions

    return async (dispatch:AppDispatch) => {
        const url = '/user/login'
        try {
            dispatch(startLoad())
            const info = await axiosPublic.post(url,{
                "password":password,
                "email" : email
            }) as AxiosResponse
            const status : number = info.status
            const token : string = info.data?.token
            const user : IUser = jwtDecode(token)
            dispatch(userLoad(user))
            localStorage.setItem("token",token)
        } catch (error) {
            const err = error as AxiosError
            if (err.response){
                const data = err.response.data as {message : string}
                dispatch(errorLoad(data.message))
            }
        }
    }
}

