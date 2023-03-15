import { Colors } from "../Colors";
import example from '../../assets/blackKing.png'
import { Cell } from "../Cell";
import { v4 } from "uuid";

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
    img : typeof example | null;
    cell : Cell;
    id : string;
    name : FigureNames;

    constructor(color:Colors,cell:Cell){
        this.color = color
        this.cell = cell
        this.cell.figure = this;
        this.img = null
        this.name = FigureNames.DEFAULT
        this.id = v4()
    }

    canMove(target:Cell) : boolean{
        // you cant eat your pieces
        if (target.figure && target.figure.color === this.color) {
            return false
        }
        // cant attack the king (mate)
        if (target.figure?.name === FigureNames.KING) {
            return false
        }
    

        return true;
    }
    moveFigure(target:Cell){
        
    }
}