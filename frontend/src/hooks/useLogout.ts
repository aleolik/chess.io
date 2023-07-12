import { useAppDispatch } from "../redux/hooks/useAppDispatch"
import { userSlice } from "../redux/reducers/userReducer"
import removeCookie from '../utils/removeCookie'
import userInstance from "../axios/userInstance"


type useLogout = () => () => void



export const useLogout : useLogout = () => {
    const dispatch = useAppDispatch()
    const doLogout = () : void => {
        const logout = userSlice.actions.logout
        userInstance.post("/user/logout").then(() => {
        }).finally(() => {
            dispatch(logout())
        })
    }

    return doLogout
}