import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";
import whiteQueen from '../chess-assets/whiteQueen.png'
import blackQueen from '../chess-assets/blackQueen.png'
import { v4 } from "uuid";

export class Queen extends Figure{
    constructor(color:Colors,figureId?:string){
        super(color,figureId ? figureId : v4())
        this.name = FigureNames.QUEEN
        this.img = color === Colors.WHITE ? whiteQueen : blackQueen
    }

    canMove(fromCell:Cell,targetCell:Cell,board:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board)) return false;

        if (board.isEmptyVertical(fromCell,targetCell)) return true;

        if (board.isEmptyHorizontal(fromCell,targetCell)) return true;

        if (board.isEmptyDiagonal(fromCell,targetCell)) return true;

        return false;
    }

    moveFigure(fromCell: Cell, targetCell: Cell, board: Board): void {
        super.moveFigure(fromCell,targetCell,board)
    }
}