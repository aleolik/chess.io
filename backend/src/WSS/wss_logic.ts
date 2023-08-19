import { WebSocketServer } from "ws"
import { IUser } from "../interfaces"
import { Colors, IMsg, ICustomWebSocket, ICustomWebSocketServer, IGameData } from "./wss_interfaces"
import { SocketMethods } from "./wss_interfaces"
import { Board } from "../chess-logic/models/Board"

export const connectionHandler = (ws : ICustomWebSocket,msg:IMsg,aWSS:ICustomWebSocketServer) => {
    const user = msg.user as IUser
    ws.user = user
    ws.id = user.id.toString()
    if (aWSS.activeGames[ws.id] && aWSS.activeGames[ws.id].gameActive) {
        const clientGameData = aWSS.activeGames[ws.id] as IGameData
        changeWebSocketData(ws,aWSS,clientGameData)
        ws.send(JSON.stringify({
            method : SocketMethods.connection,
            gameData : clientGameData
        }))
    } else {
        ws.send(JSON.stringify({
            method : SocketMethods.connection
        }))
    }   
}
export const setClientQueueStatusToActive = (ws : ICustomWebSocket) => {
    if (!ws.gameData) {
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

export const findSessionForClient = (aWSS : ICustomWebSocketServer,ws:ICustomWebSocket) => {
    aWSS.clients.forEach((client : ICustomWebSocket) => {
        if (client.inQueue){
            if (ws.id !== client.id) {
                // get random colors
                const randomNumber = Math.round(Math.random()) // 0 or 1
                const wsColor = randomNumber === 0 ? Colors.WHITE : Colors.BLACK
                const clientColor = randomNumber === 0 ? Colors.BLACK : Colors.WHITE
                const lobbyId = Date.now().toString(16)
                const defaultTime = 30

                const newBoard = new Board()
                newBoard.initCells()
                newBoard.addFigures()
                
                client.inQueue = false
                client.gameData = {
                    currentMove : Colors.WHITE,
                    lobbyId : lobbyId,
                    gameActive : true,
                    enemyUser : {
                        user : ws.user,
                        color : wsColor,
                    },
                    boardCells : newBoard.cells,
                    userColor : clientColor,
                    takenFigures : [],
                    clientTime:defaultTime,
                    enemyClientTime:defaultTime,
                    winner : null
                }
                ws.inQueue = false
                ws.gameData = {
                    currentMove : Colors.WHITE,
                    lobbyId : lobbyId,
                    gameActive : true,
                    enemyUser : {
                        user : client.user,
                        color : clientColor,
                    },
                    boardCells : newBoard.cells,
                    userColor : wsColor,
                    takenFigures : [],
                    clientTime:defaultTime,
                    enemyClientTime:defaultTime,
                    winner : null
                }

                // ADD ACTIVE GAME
                aWSS.activeGames[ws.id] = ws.gameData
                aWSS.activeGames[client.id] = client.gameData

                const clientData = JSON.stringify({
                    "method" : SocketMethods.getLobby,
                    "gameData" : client.gameData
                })
                const wsData = JSON.stringify({
                    "method" : SocketMethods.getLobby,
                    "gameData" : ws.gameData
                })
                client.send(clientData)
                ws.send(wsData)
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

export const changeWebSocketData = (ws : ICustomWebSocket,aWSS : WebSocketServer,clientGameData:IGameData) => {
    // delete active client from message
    const clients : Set<ICustomWebSocket> = new Set()
    aWSS.clients.forEach((client : ICustomWebSocket) => {
        if (client.id === ws.id) {
            client.gameData = clientGameData
        }
        clients.add(client)
    })  
    aWSS.clients = clients

}


