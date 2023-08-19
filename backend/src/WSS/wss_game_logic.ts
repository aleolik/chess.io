import { WebSocketServer } from "ws"
import { Colors, IMsg, SocketMethods, ICustomWebSocket, ICustomWebSocketServer } from "./wss_interfaces"
import { Cell } from "../chess-logic/models/Cell"
import { Figure, FigureNames } from "../chess-logic/models/Figure"


export interface ITimer{
    time : number,
    intervalId : ReturnType<typeof setInterval> | null
  }


export const updateGameDataInAwssClients = (ws : ICustomWebSocket,client:ICustomWebSocket,aWSS : ICustomWebSocketServer,msg : {
    currentMove : Colors,updatedBoardCells : Cell[][],whiteTakenFigures : Figure[],blackTakenFigures:Figure[],clientTime:number,enemyClientTime:number
}) => {
    const wsId = ws.id.toString()
    const clientId = client.id.toString()
    if (aWSS.activeGames[wsId] && aWSS.activeGames[ws.id].gameActive) {
        aWSS.activeGames[wsId].boardCells = msg.updatedBoardCells
        aWSS.activeGames[wsId].currentMove = msg.currentMove
        aWSS.activeGames[wsId].clientTime = msg.clientTime
        aWSS.activeGames[wsId].enemyClientTime = msg.enemyClientTime
        if (msg.blackTakenFigures.length + msg.whiteTakenFigures.length !== aWSS.activeGames[ws.id].takenFigures.length) {
            aWSS.activeGames[wsId].takenFigures = [...msg.blackTakenFigures,...msg.whiteTakenFigures]
        }
    }

    if (aWSS.activeGames[clientId] && aWSS.activeGames[clientId].gameActive) {
        aWSS.activeGames[clientId].boardCells = msg.updatedBoardCells
        aWSS.activeGames[clientId].currentMove = msg.currentMove
        aWSS.activeGames[clientId].clientTime = msg.enemyClientTime
        aWSS.activeGames[clientId].enemyClientTime = msg.clientTime
        if (msg.blackTakenFigures.length + msg.whiteTakenFigures.length !== aWSS.activeGames[clientId].takenFigures.length) {
            aWSS.activeGames[clientId].takenFigures = [...msg.blackTakenFigures,...msg.whiteTakenFigures]
        }
    }

}

const findClientByLobbyId = (aWSS : WebSocketServer,lobbyId:string,clientColor  : Colors) : ICustomWebSocket | null => {
    for (const client of aWSS.clients) {
        const clientModified = client as ICustomWebSocket
        if (clientModified.gameData && clientModified.gameData.lobbyId === lobbyId) {
          if (clientModified.gameData.userColor === clientColor) return clientModified
        }
      }
    return null;
}
// makeMove function,recieves new data (from ws),sets it in the aWSS.activeGames[ws.id] and aWSS.activeGames[client.id],gives new data to client(ws's opponnet)
export const makeMove = (ws : ICustomWebSocket,msg:IMsg,aWSS : ICustomWebSocketServer) => {
    const msgInfo = msg as {updatedBoardCells : Cell[][],method:string,wasMove:Colors,lobbyId:string,whiteTakenFigures : Figure[],blackTakenFigures:Figure[],clientTime:number,enemyClientTime:number}
    // find user opponent by lobbyId
    const nowMove : Colors = msgInfo.wasMove === Colors.BLACK ? Colors.WHITE : Colors.BLACK
    const client = findClientByLobbyId(aWSS,msgInfo.lobbyId,nowMove)
    if (client) {
        updateGameDataInAwssClients(ws,client,aWSS,{
            "updatedBoardCells" : msgInfo.updatedBoardCells,
            "currentMove" : nowMove,
            "blackTakenFigures" : msgInfo.blackTakenFigures,
            "whiteTakenFigures":msgInfo.whiteTakenFigures,
            "clientTime" : msgInfo.clientTime,
            "enemyClientTime" : msgInfo.enemyClientTime
        })
        client.send(JSON.stringify({
            method : SocketMethods.updateGameState,
            gameData : {
                updatedBoardCells : msgInfo.updatedBoardCells,
                whiteTakenFigures : msgInfo.whiteTakenFigures,
                blackTakenFigures : msgInfo.blackTakenFigures,
                clientTime : msgInfo.enemyClientTime,
                enemyClientTime : msgInfo.clientTime,
                currentMove : nowMove
            }
        }))
    }
}

export const endGame = (ws:ICustomWebSocket,aWSS:ICustomWebSocketServer,msg:IMsg) => {
    const msgInfo = msg as {method : SocketMethods.endGame,winnerColor : Colors | null,lobbyId:string}
    const clientsColor = msgInfo.winnerColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK
    const client = findClientByLobbyId(aWSS,msgInfo.lobbyId,clientsColor)
    if (ws && aWSS.activeGames[ws.id] && aWSS.activeGames[ws.id].gameActive) {
        aWSS.activeGames[ws.id].gameActive = false
        // clear game data client
        delete aWSS.activeGames[ws.id]
    }
    if (client && aWSS.activeGames[client.id] && aWSS.activeGames[client.id].gameActive) {
        aWSS.activeGames[client.id].gameActive = false
        // clear game data for client
         delete aWSS.activeGames[client.id]
    }

    // send to other user(client),that game has been ended
    client.send(JSON.stringify({
        "method":SocketMethods.endGame,
        "winnerColor":msg.winnerColor,
    }))
}


export const updateTimeStateForGameInServer = (ws : ICustomWebSocket,msg : IMsg,aWSS:ICustomWebSocketServer) => {
    const lobbyId = ws.gameData.lobbyId
    const msgInfo = msg as {clientTime : number,enemyClientTime : number,method : SocketMethods.updateTimeState}
    const clientsColor  = ws.gameData.userColor === Colors.BLACK ? Colors.WHITE : Colors.BLACK
    const enemyClient = findClientByLobbyId(aWSS,lobbyId,clientsColor)

    if (ws && aWSS.activeGames[ws.id] && aWSS.activeGames[ws.id].gameActive) {
        aWSS.activeGames[ws.id].clientTime = msgInfo.clientTime
        aWSS.activeGames[ws.id].enemyClientTime = msgInfo.enemyClientTime
    }

    if (enemyClient && aWSS.activeGames[enemyClient.id] && aWSS.activeGames[enemyClient.id].gameActive) {
        aWSS.activeGames[enemyClient.id].clientTime = msgInfo.enemyClientTime
        aWSS.activeGames[enemyClient.id].enemyClientTime = msgInfo.clientTime
    }
    


}