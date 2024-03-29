import { Board } from "../chess-logic/models/Board"
import { Cell } from "../chess-logic/models/Cell"
import { Figure, FigureNames } from "../chess-logic/models/Figure"
import { IUser } from "../interfaces"
import { WebSocket, WebSocketServer } from "ws"

export enum SocketMethods {
    // when 2 websockets are active they recive lobbyId
    getLobby="getLobby",
    // connects to websocket,sets it custom properties as typeof CustomWebSocket
    connection="connection",
    // Sets ws.inQueue to true
    startQueue="startQueue",
    // Sets ws.inQueue to false
    endQueue="endQueue",
    /*
        Being called after each move
        as message recives : {cells : Cell[][],currentMove:Colors,lobbyId:string}
        1)find client by color(currentMove) and lobbyId
        2)cells are already with a made move,so send it to client
    */
    makeMove="makeMove",
    // close webSocket
    closeWebsocket = "closeWebsocket",
    // update board state
    updateGameState = "updateGameState",
    endGame="endGame",
    updateTimeState="updateTimeState",
}
export interface IMsg {
    method : string
    [key : string] : unknown
}

export interface ITimer{
    time : number,
    intervalId : ReturnType<typeof setInterval> | null
 }
export interface IGameDataBackend{
    lobbyId : string,
    enemyUser : {user : IUser,color:Colors}
    gameActive : boolean
    userColor : Colors
    currentMove : Colors
    board : Board | null,
    takenFigures : {
        whiteTakenFigures : Array<{id:string,color:Colors,name:FigureNames}>,
        blackTakenFigures : Array<{id:string,color:Colors,name:FigureNames}>,
    }
    clientTimer : ITimer;
    winner : null | Colors
}



export interface ICustomWebSocketServer extends WebSocketServer {
    activeGames : { [key : string] : IGameDataBackend}
}

export interface ICustomWebSocket extends WebSocket {
    inQueue : boolean
    id : string
    user : IUser
}




export enum Colors {
    WHITE="white",
    BLACK="black",
}