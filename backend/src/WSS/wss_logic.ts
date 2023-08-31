import { WebSocketServer } from "ws"
import { IUser, IUserFromClient } from "../interfaces"
import { Colors, IMsg, ICustomWebSocket, ICustomWebSocketServer, IGameDataBackend } from "./wss_interfaces"
import { SocketMethods } from "./wss_interfaces"
import { Board } from "../chess-logic/models/Board"
import { endGameByTime,findGameDataByUserId,findWebSocketByUserId} from "./wss_game_logic"
import { v4 } from "uuid"



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
    ws.user = {
        ...user,
        id : userId
    }
    // unique socket id
    ws.id = v4()
    const wsFromAwssClients = findWebSocketByUserId(aWSS,userId,ws.id)
    // if from same browser user connected in 2 or more tabs
    if (wsFromAwssClients) {
        // regive inQueue value to new connected tab(ws)
        ws.inQueue = wsFromAwssClients.inQueue
        // if user was in game,regive gameData to new tab(ws)
        const wsData = findGameDataByUserId(aWSS,ws.user.id)
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
        // close old tab(ws)
        wsFromAwssClients.close()
    } else {
        const gameData = findGameDataByUserId(aWSS,userId)
        if (gameData) {
            const enemyWsData = findGameDataByUserId(aWSS,gameData.enemyUser?.user?.id)
            ws.send(JSON.stringify({
                method : SocketMethods.connection,
                inQueue : false,
                gameData : transformDataAsFrontendType(gameData,enemyWsData)
            }))
        }
        ws.send(JSON.stringify({
            method : SocketMethods.connection,
            inQueue : false,
            gameData : null,
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

export const setTimerForUser = (userId : string,enemyUserId : string,aWSS : ICustomWebSocketServer) => {

    if (aWSS.activeGames[userId].clientTimer.intervalId === null) {
        const intervalId = setInterval(() => {
            if (aWSS.activeGames[userId] && aWSS.activeGames[userId].clientTimer.time > 0) {
                aWSS.activeGames[userId].clientTimer.time -= 1
            } else {
                endGameByTime(userId,enemyUserId,aWSS)
            }
        },1000)
    
        aWSS.activeGames[userId].clientTimer.intervalId = intervalId
    }

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
                const defaultTime = process.env.FAST_DEFAULT_TIME === "Y"  ? 20 : 60 * 5

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
                    setTimerForUser(client.user.id,ws.user.id,aWSS)
                } else if (wsColor === Colors.WHITE) {
                    setTimerForUser(ws.user.id,client.user.id,aWSS)
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


