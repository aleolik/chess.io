import { userSlice } from "../reducers/userReducer"
import {IUser} from '../../interfaces/IUser'
import jwtDecode from "jwt-decode"
import { AxiosError, AxiosResponse } from "axios"
import { AppDispatch } from "../store/store"
import userInstance from "../../axios/userInstance"

export const LoginUserAction = (email:string,password:string) => {

    const {startLoad,errorLoad,userLoad} = userSlice.actions

    return async (dispatch:AppDispatch) => {
        const url = '/user/login'
        try {
            dispatch(startLoad())
            const res = await userInstance.post(url,{
                "password":password,
                "email" : email
            }) as AxiosResponse
            const token = res.data.token as string
            const user : IUser = jwtDecode(token)
            dispatch(userLoad(user))
        } catch (error) {
            const err = error as AxiosError
            if (err.response){
                const data = err.response.data as {message : string}
                dispatch(errorLoad(data.message))
            } else {
                dispatch(errorLoad('Status code : 500,Server Error'))
            }
        }
    }
}

