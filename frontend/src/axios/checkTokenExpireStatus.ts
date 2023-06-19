import {InternalAxiosRequestConfig } from "axios";
import axiosUser from '../axios/userInstance'
import { IUser } from "../interfaces/IUser";
import jwtDecode from "jwt-decode";
import { userSlice } from "../redux/reducers/userReducer";
import {store} from '../redux/store/store'

export const checkTokenExpireStatus =  async(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig>  => {
    const userLoad = userSlice.actions.userLoad
    const token = JSON.stringify(localStorage.getItem("token"))
    if (token) {
        try {
            const data = await axiosUser.get("/auth",{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            }) as {token : string}
            if (data.token) {
                const user : IUser = jwtDecode(token)
                if (user) {
                    store.dispatch(userLoad(user))
                }
            }
        } catch (e) {
            console.error(e)
        }
    }


    return config

}