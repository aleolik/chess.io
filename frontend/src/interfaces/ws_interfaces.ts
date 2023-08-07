import { Cell } from "../chess-logic/models/Cell";
import { Colors } from "../chess-logic/models/Colors";
import { Figure, FigureNames } from "../chess-logic/models/Figure";
import { ITimer } from "../components/ChessComponents/MultiPlayerBoardComponent/MultiPlayerBoardComponent";
import { IUser } from "./IUser";



export interface IGameData{
    lobbyId : string,
    gameActive : boolean
    userColor : Colors
    enemyUser : {user : IUser,color:Colors}
    currentMove : Colors
    clientTimer : ITimer
    enemyClientTimer : ITimer
    winner : Colors | null
}

export interface IGameDataBackend extends IGameData {
    boardCells : Cell[][]
    takenFigures : Array<{id : string,color:Colors,name : FigureNames}>
}
export interface IWebSocketState{
    ws : WebSocket | null,
    id : string | null,
    user : IUser | null,
    inQueue : boolean,
    gameData : null | IGameData // change to gameData not boolean
}

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
    // updates board state
    updateBoardState = "updateBoardState",
    // updates taken figures array
    updateTakenFiguresState = "updateTakenFiguresState",
    endGame="endGame"
}