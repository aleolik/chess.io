import { useAppDispatch } from "../redux/hooks/useAppDispatch"
import { userSlice } from "../redux/reducers/userReducer"
import userInstance from "../axios/userInstance"
import { webSocketSlice } from "../redux/reducers/webSocketReducer"


type useLogout = () => () => void



export const useLogout : useLogout = () => {
    const dispatch = useAppDispatch()
    const resetSocket = webSocketSlice.actions.resetSocket
    const doLogout = () : void => {
        const logout = userSlice.actions.logout
        userInstance.post("/user/logout").then(() => {
        }).finally(() => {
            dispatch(logout())
            dispatch(resetSocket())
        })
    }

    return doLogout
}