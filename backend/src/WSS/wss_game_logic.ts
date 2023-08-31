import { WebSocketServer } from "ws"
import { Colors, IMsg, SocketMethods, ICustomWebSocket, ICustomWebSocketServer, IGameDataBackend } from "./wss_interfaces"
import { Cell } from "../chess-logic/models/Cell"
import { Figure } from "../chess-logic/models/Figure"
import { setTimerForUser } from "./wss_logic"


export interface ITimer{
    time : number,
    intervalId : ReturnType<typeof setInterval> | null
}

enum endGameStatuses{
    TIME="TIME",
    MATE="MATE",
}

export const findWebSocketByUserId = (aWSS : ICustomWebSocketServer,userId : string,currentSocketId? : string) : null | ICustomWebSocket => {
    for (let client of aWSS.clients) {
        const clientModified = client as ICustomWebSocket
        if (clientModified.user.id === userId) {
            // curretSocketId user to find second connection for same user
            if (currentSocketId) {
                if (clientModified.id !== currentSocketId) return clientModified
            } else return clientModified
        }
    }
    
    return null
}


export const cleanGameDataAndTimersFromAwss = (aWSS : ICustomWebSocketServer,userId : string,enemyUserId : string) => {
    if (aWSS.activeGames[userId]) {
        if (aWSS.activeGames[userId].clientTimer.intervalId) {
            clearInterval(aWSS.activeGames[userId].clientTimer.intervalId)
        }
        delete aWSS.activeGames[userId]
    }
    if (aWSS.activeGames[enemyUserId]) {
        if (aWSS.activeGames[enemyUserId].clientTimer.intervalId) {
            clearInterval(aWSS.activeGames[enemyUserId].clientTimer.intervalId)
        }
        delete aWSS.activeGames[enemyUserId]
     }   
    }

// update aWSS.activeGames[userId].gameData and aWSS.activeGames[enemyUserId].gameData,whenever 1 of the webSockets made move
export const updateGameDataInAWSS = (userId : string,enemyUserId:string,aWSS : ICustomWebSocketServer,msg : {
    currentMove : Colors,updatedBoardCells : Cell[][],takenFigure : Figure | null
}) => {

    if (aWSS.activeGames[userId] && aWSS.activeGames[userId].gameActive && aWSS.activeGames[userId].board) {
        aWSS.activeGames[userId].board.cells = msg.updatedBoardCells
        aWSS.activeGames[userId].currentMove = msg.currentMove
        if (msg.takenFigure) {
            if (msg.takenFigure.color === Colors.BLACK) {
                aWSS.activeGames[userId].takenFigures.blackTakenFigures.push(msg.takenFigure)
            } else if (msg.takenFigure.color === Colors.WHITE) {
                aWSS.activeGames[userId].takenFigures.whiteTakenFigures.push(msg.takenFigure)
            }
        }
    }

    if (aWSS.activeGames[enemyUserId] && aWSS.activeGames[enemyUserId].gameActive && aWSS.activeGames[enemyUserId].board) {
        aWSS.activeGames[enemyUserId].board.cells = msg.updatedBoardCells
        aWSS.activeGames[enemyUserId].currentMove = msg.currentMove
        if (msg.takenFigure) {
            if (msg.takenFigure.color === Colors.BLACK) {
                aWSS.activeGames[enemyUserId].takenFigures.blackTakenFigures.push(msg.takenFigure)
            } else if (msg.takenFigure.color === Colors.WHITE) {
                aWSS.activeGames[enemyUserId].takenFigures.whiteTakenFigures.push(msg.takenFigure)
            }
        }
    }


}

export const findGameDataByUserId = (aWSS : ICustomWebSocketServer,userId : string) : IGameDataBackend | null => { 
    if (aWSS.activeGames && aWSS.activeGames[userId]) {
        return aWSS.activeGames[userId]
   }
   return null
}

// recieves new data (last turn made,new state of the board,new state of taken figures etc...),stores new data in the aWSS.activeGames[ws.user.id] and aWSS.activeGames[enemyWs.user.id],sends new data to enemyWs
export const makeMove = (ws : ICustomWebSocket,msg:IMsg,aWSS : ICustomWebSocketServer) => {
    const msgInfo = msg as {updatedBoardCells : Cell[][],method:string,takenFigure : null | Figure}
    const enemyUserId = aWSS.activeGames[ws.user.id]?.enemyUser?.user?.id
    const enemyWsColor : Colors = aWSS.activeGames[enemyUserId]?.userColor
    const enemyWsData = findGameDataByUserId(aWSS,enemyUserId)
    const lobbyId = aWSS.activeGames[ws.user.id]?.lobbyId
    if (enemyWsData && enemyUserId && lobbyId) {
        changeTimers(ws.user.id,enemyUserId,aWSS)
        updateGameDataInAWSS(ws.user.id,enemyUserId,aWSS,{
            "updatedBoardCells" : msgInfo.updatedBoardCells,
            "currentMove" : enemyWsColor,
            "takenFigure" : msgInfo.takenFigure,
        })
        const enemyWs = findWebSocketByUserId(aWSS,enemyUserId)
        if (enemyWs) {
            enemyWs.send(JSON.stringify({
                method : SocketMethods.updateGameState,
                gameData : {
                    updatedBoardCells : aWSS.activeGames[enemyUserId].board.cells,
                    whiteTakenFigures : aWSS.activeGames[enemyUserId].takenFigures.whiteTakenFigures,
                    blackTakenFigures : aWSS.activeGames[enemyUserId].takenFigures.blackTakenFigures,
                    currentMove : aWSS.activeGames[enemyUserId].userColor
                }
            }))
        }
    }
}

export const endGameByTime = (userId : string,enemyUserId : string,aWSS:ICustomWebSocketServer) => {
    if (aWSS.activeGames[userId] && aWSS.activeGames[enemyUserId]) {
        // send endGame event
        const lobbyId = aWSS.activeGames[userId].lobbyId
        const wsColor = aWSS.activeGames[userId].userColor
        const enemyWsColor = aWSS.activeGames[enemyUserId].userColor
        const ws = findWebSocketByUserId(aWSS,userId)
        const enemyWs = findWebSocketByUserId(aWSS,enemyUserId)
        if (aWSS.activeGames[userId].clientTimer.time <= 0) {
            // enemyWs won
            if (ws) {
                ws.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":enemyWsColor,
                    "status" : endGameStatuses.TIME,
                    "clientTime":aWSS.activeGames[userId].clientTimer.time,
                    "enemyClientTime":aWSS.activeGames[enemyUserId].clientTimer.time,
                }))
            }
            if (enemyWs) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":enemyWsColor,
                    "status" : endGameStatuses.TIME,
                    "clientTime":aWSS.activeGames[enemyUserId].clientTimer.time,
                    "enemyClientTime":aWSS.activeGames[userId].clientTimer.time,
                }))
            }
        } else if (aWSS.activeGames[enemyUserId].clientTimer.time <= 0) {
            // ws won
            if (ws) {
                ws.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":wsColor,
                    "status" : endGameStatuses.TIME,
                    "clientTime":aWSS.activeGames[userId].clientTimer.time,
                    "enemyClientTime":aWSS.activeGames[enemyUserId].clientTimer.time,
                }))
            }
            if (enemyWs) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":wsColor,
                    "status" : endGameStatuses.TIME,
                    "clientTime":aWSS.activeGames[enemyUserId].clientTimer.time,
                    "enemyClientTime":aWSS.activeGames[userId].clientTimer.time,
                }))
            }
        }
        cleanGameDataAndTimersFromAwss(aWSS,userId,aWSS.activeGames[userId].enemyUser.user.id)
    }

}

// recives the newwest(last) state of the game from ws,sends data to enemyWs and cleans it in aWSS.activeGames
export const endGameByMate = (ws:ICustomWebSocket,aWSS:ICustomWebSocketServer,msg:IMsg) => {
    const msgInfo = msg as {method : SocketMethods.endGame,winnerColor : Colors | null}
    if (ws?.user.id) {
        const lobbyId = aWSS.activeGames[ws.user.id].lobbyId
        const enemyWsColor = aWSS.activeGames[ws.user.id].enemyUser.color
        const enemyWs = findWebSocketByUserId(aWSS,aWSS.activeGames[ws.user.id].enemyUser.user.id)
        const enemyUserId = aWSS.activeGames[ws.user.id]?.enemyUser.user.id
        // game finished as tie
        if (msgInfo.winnerColor === null) {
            if (enemyWs) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":msgInfo.winnerColor,
                    "status" : endGameStatuses.MATE,
                }))
            }
            ws.send(JSON.stringify({
                "method":SocketMethods.endGame,
                "winnerColor":msgInfo.winnerColor,
                "status" : endGameStatuses.MATE,
            }))
        } else {
            // game finished as mate
            if (enemyWs) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":msgInfo.winnerColor,
                    "status" : endGameStatuses.MATE,
                }))
            }
            ws.send(JSON.stringify({
                "method":SocketMethods.endGame,
                "winnerColor":msgInfo.winnerColor,
                "status" : endGameStatuses.MATE,
            }))
        }
        if (ws && aWSS.activeGames[ws.user.id] && aWSS.activeGames[ws.user.id].gameActive) {
            aWSS.activeGames[ws.user.id].gameActive = false
        }
        if (enemyUserId && aWSS.activeGames[enemyUserId] && aWSS.activeGames[enemyUserId].gameActive) {
            aWSS.activeGames[enemyUserId].gameActive = false
        }
        cleanGameDataAndTimersFromAwss(aWSS,ws.user.id,enemyUserId)
    }
}

export const updateTimeStateForClient = (ws : ICustomWebSocket,aWSS : ICustomWebSocketServer) => {
    if (ws.user.id) {
        if (aWSS.activeGames[ws.user.id]) {
            const enemyWsData = findGameDataByUserId(aWSS,aWSS.activeGames[ws.user.id].enemyUser?.user?.id)
            if (enemyWsData) {
                ws.send(JSON.stringify({
                "method" : SocketMethods.updateTimeState,
                    "clientTime" : aWSS.activeGames[ws.user.id].clientTimer.time,
                    "enemyClientTime" : enemyWsData.clientTimer.time
                }))
            }
        }
    }

}

export const changeTimers = (userId : string,enemyUserId : string,aWSS : ICustomWebSocketServer,) => {

    if (userId) {
        if (aWSS.activeGames[userId]) {
            if (aWSS.activeGames[userId].clientTimer.intervalId){
                clearInterval(aWSS.activeGames[userId].clientTimer.intervalId)
                aWSS.activeGames[userId].clientTimer.intervalId = null
            }
        }   
    }
    setTimerForUser(enemyUserId,userId,aWSS)

}
