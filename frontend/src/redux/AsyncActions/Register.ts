import { AppDispatch } from "../store/store"
import axiosPublic from '../../axios/publicInstance'
import { IUser, userSlice } from "../reducers/userReducer"
import jwtDecode from "jwt-decode"
import { AxiosError, AxiosResponse } from "axios"

export const RegisterUserAction = (username:string,email:string,password:string,img?:string) => {

    const {startLoad,errorLoad,userLoad} = userSlice.actions

    return async (dispatch:AppDispatch) => {
        const url = '/user/register'
        try {
            dispatch(startLoad())
            const info = await axiosPublic.post(url,{
                "username" : username,
                "password":password,
                "email" : email,
                "img" : img,
            }) as AxiosResponse
            const status : number = info.status
            const token : string = info.data?.token
            const user : IUser = jwtDecode(token)
            dispatch(userLoad(user))
            localStorage.setItem("token",token)
        } catch (error) {
            const err = error as AxiosError
            if (err.response){
                const response = err.response.data as string
                dispatch(errorLoad(response))

                return response
            }
        }
    }
}

