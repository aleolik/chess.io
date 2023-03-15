import { AppDispatch } from "../store/store"
import axiosPublic from '../../axios/publicInstance'
import { IUser, userSlice } from "../reducers/userReducer"

export const RegisterUser = (username:string,email:string,password:string,img:string | null) => {

    const {startLoad,errorLoad,userLoad} = userSlice.actions

    return async (dispatch:AppDispatch) => {
        try {
            dispatch(startLoad())
            const user : IUser = await axiosPublic.post('/register',{
                username : username,
                email : email,
                password : password,
                img : img,
            })
            dispatch(userLoad(user))
        } catch (e) {

        }
    }
}