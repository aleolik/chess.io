import { NextFunction,Request,Response } from "express";
import { Board } from "../models/Board";

class BoardController{
    getNewBoard(req : Request,res : Response,next : NextFunction){
        const board = new Board()
        board.initCells()
        board.addFigures()

        return res.json({"board":board})
    }
}

export default new BoardController