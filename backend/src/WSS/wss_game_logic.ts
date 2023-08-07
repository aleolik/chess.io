import { WebSocketServer } from "ws"
import { Colors, IMsg, SocketMethods, ICustomWebSocket, ICustomWebSocketServer } from "./wss_interfaces"
import { Cell } from "../chess-logic/models/Cell"
import { Figure, FigureNames } from "../chess-logic/models/Figure"



export const updateGameDataInAwssClients = (ws : ICustomWebSocket,client:ICustomWebSocket,aWSS : ICustomWebSocketServer,msg : {
    currentMove : Colors,updatedBoardCells : Cell[][],takenFigureThisMove :  null | {id:string,color:Colors,name:FigureNames},clientTime:number,enemyClientTime:number
}) => {
    const wsId = ws.id.toString()
    const clientId = client.id.toString()
    if (aWSS.activeGames[wsId]) {
        aWSS.activeGames[wsId].boardCells = msg.updatedBoardCells
        aWSS.activeGames[wsId].currentMove = msg.currentMove
        if (msg.takenFigureThisMove && msg.takenFigureThisMove.name) {
            aWSS.activeGames[wsId].takenFigures = [...aWSS.activeGames[wsId].takenFigures,msg.takenFigureThisMove]
            aWSS.activeGames[wsId].clientTimer = {
                intervalId : null,
                time : msg.clientTime
            }
            aWSS.activeGames[wsId].enemyClientTimer = {
                intervalId : null,
                time : msg.enemyClientTime
            }
        }
    }

    if (aWSS.activeGames[clientId]) {
        aWSS.activeGames[clientId].boardCells = msg.updatedBoardCells
        aWSS.activeGames[clientId].currentMove = msg.currentMove
        if (msg.takenFigureThisMove && msg.takenFigureThisMove.name) {
            aWSS.activeGames[clientId].takenFigures = [...aWSS.activeGames[clientId].takenFigures,msg.takenFigureThisMove]
            aWSS.activeGames[clientId].clientTimer = {
                intervalId : null,
                time : msg.enemyClientTime
            }
            aWSS.activeGames[clientId].enemyClientTimer = {
                intervalId : null,
                time : msg.clientTime
            }
            

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
export const makeMove = (ws : ICustomWebSocket,msg:IMsg,aWSS : ICustomWebSocketServer) => {
    const msgInfo = msg as {updatedBoardCells : Cell[][],method:string,wasMove:Colors,lobbyId:string,takenFigureThisMove : null | {id:string,color:Colors,name:FigureNames},clientTime:number,enemyClientTime:number}
    // find user opponent by lobbyId
    const nowMove : Colors = msgInfo.wasMove === Colors.BLACK ? Colors.WHITE : Colors.BLACK
    const client = findClientByLobbyId(aWSS,msgInfo.lobbyId,nowMove)
    if (client) {
        client.gameData.boardCells = msgInfo.updatedBoardCells
        ws.gameData.boardCells = msgInfo.updatedBoardCells
        updateGameDataInAwssClients(ws,client,aWSS,{
            "updatedBoardCells" : msgInfo.updatedBoardCells,
            "currentMove" : nowMove,
            "takenFigureThisMove" : msgInfo.takenFigureThisMove,
            "clientTime" : msgInfo.clientTime,
            "enemyClientTime" : msgInfo.enemyClientTime
        })
        client.send(JSON.stringify({
            method : SocketMethods.updateBoardState,
            updatedBoardCells : msgInfo.updatedBoardCells,
            currentMove : nowMove,
        }))
        if (msgInfo.takenFigureThisMove){
            client.send(JSON.stringify({
                takenFigureThisMove : msgInfo.takenFigureThisMove,
                method : SocketMethods.updateTakenFiguresState
            }))
        }
    }
}

export const endGame = (ws:ICustomWebSocket,aWSS:ICustomWebSocketServer,msg:IMsg) => {
    const msgInfo = msg as {method : SocketMethods.endGame,winnerColor : Colors}
    if (aWSS.activeGames[ws.id]) {
        aWSS.activeGames[ws.id].winner = msgInfo.winnerColor
        aWSS.activeGames[ws.id].gameActive = false
        delete aWSS.activeGames[ws.id]
    }
}
