import { WebSocketServer } from "ws"
import { IUser, IUserFromClient } from "../interfaces"
import { Colors, IMsg, ICustomWebSocket, ICustomWebSocketServer, IGameDataBackend } from "./wss_interfaces"
import { SocketMethods } from "./wss_interfaces"
import { Board } from "../chess-logic/models/Board"
import { endGameByTime,findGameDataByUserId,findWebSocketStoredInAWSS} from "./wss_game_logic"
import { v4 } from "uuid"

export const findWebSocketById = (aWSS : ICustomWebSocketServer,id : String) : ICustomWebSocket | null => {
    for (const client of aWSS.clients) {
        const clientModified = client as ICustomWebSocket
        const clientId = clientModified?.id
        if (clientId && clientId === id) {
          return clientModified
        }
      }
    return null;
}
// transforms data and sends it to frontend
export const transformDataAsFrontendType = (wsData : IGameDataBackend,enemyWsData : IGameDataBackend)  => {

    if (wsData && enemyWsData) {
        return {
            clientTime : wsData.clientTimer.time,
            enemyClientTime : enemyWsData.clientTimer.time,
            currentMove : wsData.currentMove,
            gameActive : wsData.gameActive,
            lobbyId : wsData.lobbyId,
            userColor : wsData.userColor,
            enemyUser : wsData.enemyUser,
            winner : wsData.winner,
            board : wsData.board,
            whiteTakenFigures : wsData.takenFigures.whiteTakenFigures,
            blackTakenFigures : wsData.takenFigures.blackTakenFigures,
        }
    }
}

export const connectionHandler = (ws : ICustomWebSocket,msg:IMsg,aWSS:ICustomWebSocketServer) => {
    const user = msg.user as IUserFromClient
    const userId = user?.id.toString() // user id
    const wsId = v4() // unique id 
    ws.user = {
        ...user,
        id : userId
    }
    ws.id = userId + "(wsId)"
    const wsFromAwssClients = findWebSocketById(aWSS,userId)
    if (wsFromAwssClients) {
        ws.inQueue = wsFromAwssClients.inQueue
        const wsData = findGameDataByUserId(aWSS,userId)
        if (wsData) {
            const enemyWsData = findGameDataByUserId(aWSS,wsData.enemyUser.user.id)
            if (enemyWsData) {
                const gameData = transformDataAsFrontendType(wsData,enemyWsData)
                if (gameData) {
                    ws.send(JSON.stringify({
                        method : SocketMethods.connection,
                        inQueue : ws.inQueue,
                        gameData : gameData,
                    }))
                }
            }
        } else {
            ws.send(JSON.stringify({
                method : SocketMethods.connection,
                inQueue : ws.inQueue,
            }))
        }
    } else {
        ws.send(JSON.stringify({
            method : SocketMethods.connection,
            inQueue : false,
        }))
    }
}
export const setClientQueueStatusToActive = (ws : ICustomWebSocket,aWSS : ICustomWebSocketServer) => {
    if (!aWSS.activeGames[ws.user.id] || aWSS.activeGames[ws.user.id].gameActive === false) {
        ws.inQueue = true
        ws.send(JSON.stringify({
            method : SocketMethods.startQueue
        }))
    }
}
export const setClientQueueStatusToUnactive = (ws : ICustomWebSocket) => {
    ws.inQueue = false
    ws.send(JSON.stringify({
        method : SocketMethods.endQueue
    }))
}

export const setTimerForWs = (wsId : string,enemyWsId : string,aWSS : ICustomWebSocketServer) => {
    const intervalId = setInterval(() => {
        if (aWSS.activeGames[wsId] && aWSS.activeGames[wsId].clientTimer.time > 0) {
            aWSS.activeGames[wsId].clientTimer.time -= 1
        } else {
            endGameByTime(wsId,enemyWsId,aWSS)
        }
    },1000)

    aWSS.activeGames[wsId].clientTimer.intervalId = intervalId

}

export const findSessionForClient = (aWSS : ICustomWebSocketServer,ws:ICustomWebSocket) => {
    aWSS.clients.forEach((client : ICustomWebSocket) => {
        if (client.inQueue){
            if (ws.user.id !== client.user.id) {
                // get random colors
                const randomNumber = Math.round(Math.random()) // 0 or 1
                const wsColor = randomNumber === 0 ? Colors.WHITE : Colors.BLACK
                const clientColor = randomNumber === 0 ? Colors.BLACK : Colors.WHITE
                const lobbyId = Date.now().toString(16)
                const defaultTime = 60 * 0.5

                const newBoard = new Board()
                newBoard.initCells()
                newBoard.addFigures()
                
                client.inQueue = false
                ws.inQueue = false


                const wsGameData = {
                    currentMove : Colors.WHITE,
                    lobbyId : lobbyId,
                    gameActive : true,
                    enemyUser : {
                        user : client.user,
                        color : clientColor,
                    },
                    board : newBoard,
                    userColor : wsColor,
                    takenFigures : {
                        blackTakenFigures : [],
                        whiteTakenFigures : [],
                    },
                    clientTimer:{
                        time : defaultTime,
                        intervalId : null
                    },
                    winner : null
                }
                const enemyWsGameData = {
                    currentMove : Colors.WHITE,
                    lobbyId : lobbyId,
                    gameActive : true,
                    enemyUser : {
                        user : ws.user,
                        color : wsColor,
                    },
                    board : newBoard,
                    userColor : clientColor,
                    takenFigures : {
                        blackTakenFigures : [],
                        whiteTakenFigures : [],
                    },
                    clientTimer:{
                        time : defaultTime,
                        intervalId : null
                    },
                    winner : null
                }
                // ADD ACTIVE GAME
                aWSS.activeGames[ws.user.id] = wsGameData
                aWSS.activeGames[client.user.id] = enemyWsGameData
                const clientData = JSON.stringify({
                    "method" : SocketMethods.getLobby,
                    "gameData" : transformDataAsFrontendType(enemyWsGameData,wsGameData)
                })
                const wsData = JSON.stringify({
                    "method" : SocketMethods.getLobby,
                    "gameData" : transformDataAsFrontendType(wsGameData,enemyWsGameData)
                })
                
                client.send(clientData)
                ws.send(wsData)

                // start timer for white
                if (clientColor === Colors.WHITE) {
                    setTimerForWs(client.user.id,ws.user.id,aWSS)
                } else if (wsColor === Colors.WHITE) {
                    setTimerForWs(ws.user.id,client.user.id,aWSS)
                }
            }
        }
    })
}

export const closeWebSocketAction = (ws : ICustomWebSocket,aWSS : WebSocketServer) => {
    // delete active client from message
    const clients : Set<ICustomWebSocket> = new Set()
    aWSS.clients.forEach((client : ICustomWebSocket) => {
        if (client.id !== ws.id) {
            clients.add(client)
        }
    })  
    aWSS.clients = clients

}


