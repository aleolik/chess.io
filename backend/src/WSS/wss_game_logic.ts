import { WebSocketServer } from "ws"
import { Colors, IMsg, SocketMethods, ICustomWebSocket, ICustomWebSocketServer, IGameDataBackend } from "./wss_interfaces"
import { Cell } from "../chess-logic/models/Cell"
import { Figure } from "../chess-logic/models/Figure"
import { setTimerForWs } from "./wss_logic"


export interface ITimer{
    time : number,
    intervalId : ReturnType<typeof setInterval> | null
  }


export const cleanGameDataAndTimersFromAwss = (aWSS : ICustomWebSocketServer,wsId:string,enemyWsId:string) => {
    if (wsId && enemyWsId) {
        if (aWSS.activeGames[wsId]) {
            if (aWSS.activeGames[wsId].clientTimer.intervalId) {
                clearInterval(aWSS.activeGames[wsId].clientTimer.intervalId)
            }
            delete aWSS.activeGames[wsId]
        }
        if (aWSS.activeGames[enemyWsId]) {
            if (aWSS.activeGames[enemyWsId].clientTimer.intervalId) {
                clearInterval(aWSS.activeGames[enemyWsId].clientTimer.intervalId)
            }
            delete aWSS.activeGames[enemyWsId]
        }
    }
}

// update aWSS.activeGames[wsId].gameData and aWSS.activeGames[enemyWsId].gameData,whenever 1 of the webSockets made move
export const updateGameDataInAWSS = (wsId : string,enemyWsId:string,aWSS : ICustomWebSocketServer,msg : {
    currentMove : Colors,updatedBoardCells : Cell[][],takenFigure : Figure | null
}) => {
    if (aWSS.activeGames[wsId] && aWSS.activeGames[wsId].gameActive && aWSS.activeGames[wsId].board) {
        aWSS.activeGames[wsId].board.cells = msg.updatedBoardCells
        aWSS.activeGames[wsId].currentMove = msg.currentMove
        if (msg.takenFigure) {
            if (msg.takenFigure.color === Colors.BLACK) {
                aWSS.activeGames[wsId].takenFigures.blackTakenFigures.push(msg.takenFigure)
            } else if (msg.takenFigure.color === Colors.WHITE) {
                aWSS.activeGames[wsId].takenFigures.whiteTakenFigures.push(msg.takenFigure)
            }
        }
    }

    if (aWSS.activeGames[enemyWsId] && aWSS.activeGames[enemyWsId].gameActive && aWSS.activeGames[enemyWsId].board) {
        aWSS.activeGames[enemyWsId].board.cells = msg.updatedBoardCells
        aWSS.activeGames[enemyWsId].currentMove = msg.currentMove
        if (msg.takenFigure) {
            if (msg.takenFigure.color === Colors.BLACK) {
                aWSS.activeGames[enemyWsId].takenFigures.blackTakenFigures.push(msg.takenFigure)
            } else if (msg.takenFigure.color === Colors.WHITE) {
                aWSS.activeGames[enemyWsId].takenFigures.whiteTakenFigures.push(msg.takenFigure)
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
// find webSocket stored in aWSS.activeGames by lobbyId and ws.gameData.userColor
export const findWebSocketStoredInAWSS = (aWSS : ICustomWebSocketServer,lobbyId:string,usersColorToFind  : Colors) : ICustomWebSocket | null => {
    for (const client of aWSS.clients) {
        const clientModified = client as ICustomWebSocket
        const clientId = clientModified?.id
        if (clientId && aWSS.activeGames[clientId] && aWSS.activeGames[clientId].lobbyId === lobbyId) {
          if (aWSS.activeGames[clientId].userColor === usersColorToFind) return clientModified
        }
      }
    return null;
}
// recieves new data (last turn made,new state of the board,new state of taken figures etc...),stores new data in the aWSS.activeGames[ws.user.id] and aWSS.activeGames[enemyWs.user.id],sends new data to enemyWs
export const makeMove = (ws : ICustomWebSocket,msg:IMsg,aWSS : ICustomWebSocketServer) => {
    const msgInfo = msg as {updatedBoardCells : Cell[][],method:string,takenFigure : null | Figure}
    // enemyWsColor is instance of Colors,that is equal to enemyWs.gameData.userColor
    const enemyWsColor : Colors = aWSS.activeGames[ws.user.id].enemyUser.color
    const enemyWsData = findGameDataByUserId(aWSS,aWSS.activeGames[ws.user.id].enemyUser?.user?.id)
    const lobbyId = aWSS.activeGames[ws.user.id]?.lobbyId
    if (enemyWsData) {
        changeTimers(aWSS,ws.user.id.toString(),aWSS.activeGames[ws.user.id].enemyUser.user.id.toString())
        updateGameDataInAWSS(ws.user.id,aWSS.activeGames[ws.user.id].enemyUser?.user?.id.toString(),aWSS,{
            "updatedBoardCells" : msgInfo.updatedBoardCells,
            "currentMove" : enemyWsColor,
            "takenFigure" : msgInfo.takenFigure,
        })
        const enemyWs = findWebSocketStoredInAWSS(aWSS,lobbyId,enemyWsColor)
        if (enemyWs) {
            enemyWs.send(JSON.stringify({
                method : SocketMethods.updateGameState,
                gameData : {
                    updatedBoardCells : aWSS.activeGames[enemyWs.user.id].board.cells,
                    whiteTakenFigures : aWSS.activeGames[enemyWs.user.id].takenFigures.whiteTakenFigures,
                    blackTakenFigures : aWSS.activeGames[enemyWs.user.id].takenFigures.blackTakenFigures,
                    currentMove : aWSS.activeGames[enemyWs.user.id].userColor
                }
            }))
        }
    }
}

export const endGameByTime = (wsId : string,enemyWsId : string,aWSS:ICustomWebSocketServer) => {
    if (wsId && aWSS.activeGames[wsId] && enemyWsId && aWSS.activeGames[enemyWsId]) {
        // send endGame event
        const lobbyId = aWSS.activeGames[wsId].lobbyId
        const wsColor = aWSS.activeGames[wsId].userColor
        const enemyWsColor = aWSS.activeGames[enemyWsId].userColor
        const ws = findWebSocketStoredInAWSS(aWSS,lobbyId,wsColor)
        const enemyWs = findWebSocketStoredInAWSS(aWSS,lobbyId,enemyWsColor)
        if (aWSS.activeGames[wsId].clientTimer.time <= 0) {
            // enemyWs won
            if (ws) {
                ws.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":enemyWsColor,
                }))
            }
            if (enemyWs) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":enemyWsColor,
                }))
            }
        } else if (aWSS.activeGames[enemyWsId].clientTimer.time <= 0) {
            // ws won
            if (ws) {
                ws.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":wsColor,
                }))
            }
            if (enemyWs) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":wsColor,
                }))
            }
        }
        cleanGameDataAndTimersFromAwss(aWSS,wsId,enemyWsId)
    }

}

// recives the newwest(last) state of the game from ws,sends data to enemyWs and cleans it in aWSS.activeGames
export const endGameByMate = (ws:ICustomWebSocket,aWSS:ICustomWebSocketServer,msg:IMsg) => {
    const msgInfo = msg as {method : SocketMethods.endGame,winnerColor : Colors | null}
    if (ws?.user?.id) {
        const lobbyId = aWSS.activeGames[ws.user.id].lobbyId
        const enemyWsColor = aWSS.activeGames[ws.user.id].enemyUser.color
        const enemyWs = findWebSocketStoredInAWSS(aWSS,lobbyId,enemyWsColor)
        
        if (enemyWs) {
            // game finished as tie
            if (msgInfo.winnerColor === null) {
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":msgInfo.winnerColor,
                }))
                ws.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":msgInfo.winnerColor,
            }))
            } else {
                // game finished as mate
                enemyWs.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":msgInfo.winnerColor,
                }))
                ws.send(JSON.stringify({
                    "method":SocketMethods.endGame,
                    "winnerColor":msgInfo.winnerColor,
                }))
            }
            if (ws && aWSS.activeGames[ws.user.id] && aWSS.activeGames[ws.user.id].gameActive) {
                aWSS.activeGames[ws.user.id].gameActive = false
            }
            if (enemyWs && aWSS.activeGames[enemyWs.user.id] && aWSS.activeGames[enemyWs.user.id].gameActive) {
                aWSS.activeGames[enemyWs.user.id].gameActive = false
            }
            cleanGameDataAndTimersFromAwss(aWSS,ws.user.id,enemyWs.user.id)
        }
    }
}

export const updateTimeStateForClient = (ws : ICustomWebSocket,aWSS : ICustomWebSocketServer) => {
    if (ws.user.id) {
        if (aWSS.activeGames[ws.user.id]) {
            const enemyWsData = findGameDataByUserId(aWSS,aWSS.activeGames[ws.user.id].enemyUser?.user?.id)
            if (enemyWsData) {
                ws.send(JSON.stringify({
                "method" : SocketMethods.updateTimeState,
                    "wsTime" : aWSS.activeGames[ws.user.id].clientTimer.time,
                    "enemyWsTime" : enemyWsData.clientTimer.time
                }))
            }
        }
    }

}

export const changeTimers = (aWSS : ICustomWebSocketServer,wsId : string,enemyWsId : string) => {

    if (wsId) {
        if (aWSS.activeGames[wsId]) {
            if (aWSS.activeGames[wsId].clientTimer.intervalId){
                clearInterval(aWSS.activeGames[wsId].clientTimer.intervalId)
                aWSS.activeGames[wsId].clientTimer.intervalId = null
            }
        }   
    }
    setTimerForWs(enemyWsId,wsId,aWSS)

}
