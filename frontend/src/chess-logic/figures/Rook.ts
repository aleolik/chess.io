import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";
import whiteRook from '../chess-assets/whiteRook.png'
import blackRook from '../chess-assets/blackRook.png'

export class Rook extends Figure{
    constructor(color:Colors){
        super(color)
        this.name = FigureNames.ROOK
        this.img  = color === Colors.WHITE ? whiteRook : blackRook
    }

    canMove(fromCell: Cell,targetCell:Cell,board:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board)) {
            return false
        }

        if (board.isEmptyHorizontal(fromCell,targetCell)) return true

        if (board.isEmptyVertical(fromCell,targetCell)) return true

        return false;
    }

    moveFigure(fromCell: Cell, targetCell: Cell, board: Board): void {
        super.moveFigure(fromCell,targetCell,board)
    }

}