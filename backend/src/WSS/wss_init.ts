import CreateWebSocketServer from 'express-ws'
import {Application}from 'express'
import { WebSocketServer,WebSocket  } from 'ws'
import { SocketMethods } from './wss_interfaces'
import { IUser } from '../interfaces'

interface IMsg {
    id  : number
    method : string
    [key : string] : unknown
}

interface customWebSocket extends WebSocket {
    inQueue : boolean
    id : string
    user : IUser
}

const connectionHandler = (ws : customWebSocket,msg:IMsg) => {
   const user = msg.user as IUser
   ws.inQueue = false
   ws.user = user
   ws.id = user.id.toString()
}
const setClientQueueStatusToActive = (ws : customWebSocket) => {
    ws.inQueue = true
}
const setClientQueueStatusToUnactive = (ws : customWebSocket) => {
    ws.inQueue = false
}
const findSessionForClient = (aWSS : WebSocketServer,ws:customWebSocket) => {
    aWSS.clients.forEach((client) => {
        const currentWS = Object.create(client) as customWebSocket
        if (ws.id !== currentWS.id) {
            if (currentWS.inQueue){
                const lobbyId = Date.now().toString(16)
                // At least 2 players are ready,so create a lobby for them
                currentWS.send(JSON.stringify({
                    lobbyId : lobbyId,
                    method : SocketMethods.getLobby,
                    // opponent user
                    user : ws.user,
                }))
                currentWS.inQueue = false
                ws.send(JSON.stringify({
                    lobbyId : lobbyId,
                    method : SocketMethods.getLobby,
                    // opponent user
                    user : currentWS.user
                }))
                ws.inQueue = false
            }
        }  
    })
}


const initalizeWebSocketServer = (app:Application) => {
    const WSS = CreateWebSocketServer(app)
    const aWSS = WSS.getWss()
    WSS.app.ws('/',(ws : WebSocket,req) => {
        ws.on('message',(msg) => {
            const parsedMessage = JSON.parse(msg.toString()) as IMsg
            switch(parsedMessage.method){
                case SocketMethods.connection:
                    // user connected to server,do nothing
                    connectionHandler(ws as customWebSocket,parsedMessage)
                    break;
                case SocketMethods.startQueue:
                    // user started a query,give user active status
                    setClientQueueStatusToActive(ws as customWebSocket)
                    findSessionForClient(aWSS,ws as customWebSocket)
                    break;
                case SocketMethods.endQueue:
                    // user ended a query

                    setClientQueueStatusToUnactive(ws as customWebSocket)
                    break;
                default:
                    break;
            }
        })
    })
    return WSS
}

export default initalizeWebSocketServer