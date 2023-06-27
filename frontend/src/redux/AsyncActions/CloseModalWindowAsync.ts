import { modalSlice } from "../reducers/modalReducer"
import { AppDispatch, RootState } from "../store/store"

export const closeModalWindowAsync = () => {

    const closeModalWindow = modalSlice.actions.closeModalWindow
    return async (dispatch:AppDispatch,getState : () => RootState) => {
        const {userOnError,user} = getState().user
        if (user && !userOnError) {
            dispatch(closeModalWindow())
        }
    }
}

