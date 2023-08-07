import CreateWebSocketServer from 'express-ws'
import {Application}from 'express'
import { WebSocket  } from 'ws'
import { IMsg, SocketMethods,ICustomWebSocket, ICustomWebSocketServer } from './wss_interfaces'
import {connectionHandler,setClientQueueStatusToActive,setClientQueueStatusToUnactive,findSessionForClient,closeWebSocketAction} from './wss_logic'
import { endGame, makeMove } from './wss_game_logic'
// import { makeMove } from './wss_game_logic'


const initalizeWebSocketServer = (app:Application) => {
    const WSS = CreateWebSocketServer(app)
    const aWSS = WSS.getWss() as ICustomWebSocketServer
    aWSS.activeGames = {}
    WSS.app.ws('/',(ws : WebSocket,req) => {
        ws.on('message',(msg) => {
            const parsedMessage = JSON.parse(msg.toString()) as IMsg
            switch(parsedMessage.method){
                case SocketMethods.connection:
                    // user connected to server,do nothing
                    connectionHandler(ws as ICustomWebSocket,parsedMessage,aWSS)
                    break;
                case SocketMethods.startQueue:
                    // user started a query,give user active status
                    setClientQueueStatusToActive(ws as ICustomWebSocket)
                    findSessionForClient(aWSS,ws as ICustomWebSocket)
                    break;
                case SocketMethods.endQueue:
                    // user ended a query
                    setClientQueueStatusToUnactive(ws as ICustomWebSocket)
                    break;
                case SocketMethods.makeMove:
                    makeMove(ws as ICustomWebSocket,parsedMessage,aWSS)
                    break;
                case SocketMethods.endGame:
                    endGame(ws as ICustomWebSocket,aWSS,parsedMessage)
                default:
                    break;
            }
        })
        ws.on('close', () => {
            closeWebSocketAction(ws as ICustomWebSocket,aWSS)
        })
    })
    return WSS
}

export default initalizeWebSocketServer