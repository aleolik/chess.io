import CreateWebSocketServer from 'express-ws'
import {Application}from 'express'
import { WebSocket  } from 'ws'
import { IMsg, SocketMethods,customWebSocket } from './wss_interfaces'
import {connectionHandler,setClientQueueStatusToActive,setClientQueueStatusToUnactive,findSessionForClient} from './wss_logic'
import { makeMove } from './wss_game_logic'


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
                case SocketMethods.makeMove:
                    makeMove(ws as customWebSocket,parsedMessage,aWSS)
                    break;
                default:
                    break;
            }
        })
    })
    return WSS
}

export default initalizeWebSocketServer