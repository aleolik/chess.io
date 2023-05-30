import { useAppDispatch } from "../redux/hooks/useAppDispatch"
import { userSlice } from "../redux/reducers/userReducer"

type useLogout = () => () => void

export const useLogout : useLogout = () => {
    const dispatch = useAppDispatch()
    const doLogout = () : void => {
        const logout = userSlice.actions.logout
        dispatch(logout())
        localStorage.removeItem("token")
    }

    return doLogout
}