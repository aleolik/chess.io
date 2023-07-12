import { NextFunction,Response } from "express";
import { Board } from "../models/Board";
import { IRequestWithUser, } from "../../interfaces";

class BoardController{
    getNewBoard(Request : IRequestWithUser,res : Response,next : NextFunction){
        const board = new Board()
        board.initCells()
        board.addFigures()

        return res.json({"board":board})
    }
}

export default new BoardController