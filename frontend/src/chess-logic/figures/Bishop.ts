import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";
import whiteBishop from '../chess-assets/whiteBishop.png'
import blackBishop from '../chess-assets/blackBishop.png'

export class Bishop extends Figure{
    constructor(color:Colors){
        super(color)
        this.name = FigureNames.BISHOP
        this.img = color === Colors.WHITE ? whiteBishop : blackBishop
    }


    canMove(fromCell:Cell,targetCell: Cell,board:Board,deepCopyBoard:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board,deepCopyBoard)) {
            return false
        }

        if (board.isEmptyDiagonal(fromCell,targetCell)) return true

        return false
    }

    moveFigure(fromCell: Cell, targetCell: Cell, board: Board): void {
        super.moveFigure(fromCell,targetCell,board)
    }

}