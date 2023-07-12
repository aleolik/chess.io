import { WebSocketServer } from "ws"
import { IUser } from "../interfaces"
import { Colors, IMsg, customWebSocket } from "./wss_interfaces"
import { SocketMethods } from "./wss_interfaces"

export const connectionHandler = (ws : customWebSocket,msg:IMsg) => {
    const user = msg.user as IUser
    ws.user = user
    ws.id = user.id.toString()
    ws.send(JSON.stringify({
        method : SocketMethods.connection
    }))
}
export const setClientQueueStatusToActive = (ws : customWebSocket) => {
    ws.inQueue = true
    ws.send(JSON.stringify({
        method : SocketMethods.startQueue
    }))
}
export const setClientQueueStatusToUnactive = (ws : customWebSocket) => {
    ws.inQueue = false
    ws.send(JSON.stringify({
        method : SocketMethods.endQueue
    }))
}

export const findSessionForClient = (aWSS : WebSocketServer,ws:customWebSocket) => {
    aWSS.clients.forEach((client : customWebSocket) => {
        if (client.inQueue){
            if (ws.id !== client.id) {
                // get random colors
                const randomNumber = Math.round(Math.random()) // 0 or 1
                if (randomNumber === 0) {
                    ws.color = Colors.WHITE
                    client.color = Colors.BLACK
                } else {
                    ws.color = Colors.BLACK
                    client.color = Colors.WHITE
                }
                const lobbyId = Date.now().toString(16)
                client.inQueue = false
                client.currentMove = Colors.WHITE
                client.lobbyId = lobbyId
                ws.inQueue = false
                ws.currentMove = Colors.WHITE
                ws.lobbyId = lobbyId
                const clientData = JSON.stringify({
                    "method" : SocketMethods.getLobby,
                    "color":client.color,
                    "enemyUser":{
                        color : ws.color,
                        user : ws.user,
                    },
                    "lobbyId" : lobbyId,
                })
                const wsData = JSON.stringify({
                    "method" : SocketMethods.getLobby,
                    "color":ws.color,
                    "enemyUser":{
                        user : client.user,
                        color : client.color
                    },
                    "lobbyId" : lobbyId,
                })
                client.send(clientData)
                ws.send(wsData)
            }
        }
    })
}


