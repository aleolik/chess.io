import { Colors } from "./Colors";
import { Cell } from "./Cell";
import { v4 } from "uuid";
import { Board } from "./Board";
import imgExample from '../chess-assets/blackBishop.png'

export enum FigureNames{
    "DEFAULT" = "default",
    "KING"= "KING",
    "QUEEN" = "QUEEN",
    "PAWN" = "PAWN",
    "BISHOP" = "BISHOP",
    "ROOK" = "ROOK",
    "HORSE" = "HORSE"
}

export class Figure{
    color: Colors;
    id : string;
    name : FigureNames;
    img : typeof imgExample | null = null

    constructor(color:Colors){
        this.color = color
        this.name = FigureNames.DEFAULT
        this.id = v4()
    }
    
    canMove(fromCell:Cell,targetCell:Cell,deepCopiedBoard:Board) : boolean{
        // RULE : Can not attack your's figures
        if (targetCell.figure && targetCell.figure.color === fromCell?.figure?.color) return false

        return true;
    }

    moveFigure(fromCell:Cell,targetCell:Cell,board:Board) : void{
        targetCell.figure = fromCell.figure
        fromCell.figure = null
    }

}