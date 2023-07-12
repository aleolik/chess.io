import { AppDispatch } from "../store/store"
import { userSlice } from "../reducers/userReducer"
import { IUser } from "../../interfaces/IUser"
import jwtDecode from "jwt-decode"
import { AxiosError, AxiosResponse } from "axios"
import userInstance from "../../axios/userInstance"



export const RegisterUserAction = (username:string,email:string,password:string) => {

    const {startLoad,errorLoad,userLoad} = userSlice.actions

    return async (dispatch:AppDispatch) : Promise<void> => {
        const url = '/user/register'
        try {
            dispatch(startLoad())
            const res = await userInstance.post(url,{
                "username" : username,
                "password":password,
                "email" : email,
            }) as AxiosResponse 
           const token : string = res.data.token as string
           const user : IUser = jwtDecode(token)
           dispatch(userLoad(user))
        } catch (error) {
            const err = error as AxiosError
            if (err.response){
                const data = err.response.data as {message : string}
                dispatch(errorLoad(data.message))
            } else {
                dispatch(errorLoad('Status code : 500,Server error'))
            }
        }
    }
}

