import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";

export class Bishop extends Figure{
    constructor(color:Colors){
        super(color)
        this.name = FigureNames.BISHOP
    }


    canMove(fromCell:Cell,targetCell: Cell,board:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board)) {
            return false
        }

        if (board.isEmptyDiagonal(fromCell,targetCell)) return true

        return false
    }

}