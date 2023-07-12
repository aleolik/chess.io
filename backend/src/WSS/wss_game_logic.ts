import { WebSocketServer } from "ws"
import { Board } from "../chess-logic/models/Board"
import { IUser } from "../interfaces"
import { Colors, IMsg, SocketMethods, customWebSocket } from "./wss_interfaces"
import { Cell } from "../chess-logic/models/Cell"
import { Figure, FigureNames } from "../chess-logic/models/Figure"

const findClientByLobbyId = (aWSS : WebSocketServer,lobbyId:string,currentMove  : Colors) : customWebSocket | null => {
    for (const client of aWSS.clients) {
        const clientModified = client as customWebSocket
        if (clientModified?.lobbyId && clientModified.lobbyId === lobbyId) {
          if (currentMove === Colors.BLACK && clientModified.color === Colors.WHITE) return clientModified;
          if (currentMove === Colors.WHITE && clientModified.color === Colors.BLACK) return clientModified;
        }
      }
    return null;
}
export const makeMove = (ws : customWebSocket,msg:IMsg,aWSS : WebSocketServer) => {
    const msgInfo = msg as {cells : Cell[][],method:string,currentMove:Colors,lobbyId:string,takenFigureThisMove : null | {id:string,color:Colors,name:FigureNames}}
    // find user opponent by lobbyId
    const client = findClientByLobbyId(aWSS,msgInfo.lobbyId,msgInfo.currentMove)
    if (client) {
        client.send(JSON.stringify({
            method : SocketMethods.makeMove,
            cells : msgInfo.cells,
            currentMove : client.color,
            takenFigureThisMove : msgInfo.takenFigureThisMove
        }))
    }
}