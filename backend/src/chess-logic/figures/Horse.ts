import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";

export class Horse extends Figure{
    constructor(color:Colors){
        super(color)
        this.name = FigureNames.HORSE
    }

    canMove(fromCell: Cell,targetCell:Cell,board:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board)) {
            return false
        }

        const IMove = Math.abs(fromCell.i - targetCell.i)
        const JMove = Math.abs(fromCell.j - targetCell.j)
        if (IMove === 1 && JMove === 2 || IMove === 2 && JMove === 1) return true

        return false
    }

}