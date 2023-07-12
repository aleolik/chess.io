import { IUser } from "../interfaces"
import { WebSocket } from "ws"

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
}
export interface IMsg {
    method : string
    [key : string] : unknown
}
export interface customWebSocket extends WebSocket {
    inQueue : boolean
    id : string
    user : IUser
    color? : Colors
    currentMove? : Colors
    lobbyId? : string
}




export enum Colors {
    WHITE="white",
    BLACK="black",
}