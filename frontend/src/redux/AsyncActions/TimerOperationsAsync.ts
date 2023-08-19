import { Colors } from "../../chess-logic/models/Colors"
import { modalSlice } from "../reducers/modalReducer"
import { ITimerWithType, webSocketSlice } from "../reducers/webSocketReducer"
import { AppDispatch, RootState } from "../store/store"

export const ChangeTimerAsync = () => {
    return async (dispatch:AppDispatch,getState : () => RootState) => {
        const {activateTimer,deactivateTimer,setIntervalIdForTimer} = webSocketSlice.actions
        const clientTimer = getState().webSocket.gameData?.clientTimer
        const enemyClientTimer = getState().webSocket.gameData?.enemyClientTimer

        if (clientTimer && enemyClientTimer) {
            if (clientTimer.intervalId) {
                dispatch(deactivateTimer({
                    ...clientTimer,
                    timerType : 'client'
                }))
                const intervalId = setInterval(() => {
                    dispatch(activateTimer({
                        ...enemyClientTimer,
                        timerType : 'enemyClient'
                    }))
                },1000)
                dispatch(setIntervalIdForTimer({
                    intervalId : intervalId,
                    timerType : 'enemyClient'
                }))
            } else if (enemyClientTimer.intervalId) {
                dispatch(deactivateTimer({
                    ...enemyClientTimer,
                    timerType : 'enemyClient'
                }))
                const intervalId = setInterval(() => {
                    dispatch(activateTimer({
                        ...clientTimer,
                        timerType : 'client'
                    }))
                },1000)
                dispatch(setIntervalIdForTimer({
                    intervalId : intervalId,
                    timerType : 'client'
                }))
            }
        }
    }
}

export const ActivateTimerAsync = (currentMove : Colors) => {
    return async (dispatch:AppDispatch,getState : () => RootState) => {
        const {activateTimer,setIntervalIdForTimer} = webSocketSlice.actions
        const clientTimer = getState().webSocket.gameData?.clientTimer
        const enemyClientTimer = getState().webSocket.gameData?.enemyClientTimer
        const userColor = getState().webSocket.gameData?.userColor

        if (clientTimer && enemyClientTimer && userColor) {
            if (userColor !== currentMove) {
                const intervalId = setInterval(() => {
                    dispatch(activateTimer({
                        ...enemyClientTimer,
                        timerType : 'enemyClient'
                    }))
                },1000)
                dispatch(setIntervalIdForTimer({
                    intervalId : intervalId,
                    timerType : 'enemyClient'
                }))
            } else if (userColor === Colors.WHITE) {
                const intervalId = setInterval(() => {
                    dispatch(activateTimer({
                        ...clientTimer,
                        timerType : 'client'
                    }))
                },1000)
                dispatch(setIntervalIdForTimer({
                    intervalId : intervalId,
                    timerType : 'client'
                }))
            }
        }
    }
}

export const DeactivateTimersAsync = () => {
    return async (dispatch:AppDispatch,getState : () => RootState) => {
        const clientTimer = getState().webSocket.gameData?.clientTimer
        const enemyClientTimer = getState().webSocket.gameData?.enemyClientTimer
        const {deactivateTimer} = webSocketSlice.actions

        if (clientTimer && enemyClientTimer) {
            dispatch(deactivateTimer({
                ...clientTimer,
                timerType : 'client'
            }))
            dispatch(deactivateTimer({
                ...enemyClientTimer,
                timerType : 'enemyClient'
            }))
        }
    }
}