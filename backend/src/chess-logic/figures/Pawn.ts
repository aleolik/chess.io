import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";
import { Queen } from "./Queen";
export class Pawn extends Figure{

    isFirstTurn : boolean = true

    constructor(color:Colors){
        super(color)
        this.name = FigureNames.PAWN
    }

    canMove(fromCell: Cell,targetCell:Cell,board:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board)) {
            return false
        }
        // BLACK = MOVE TO BOTTOM,WHITE = MOVE TO TOP
        const direction = this.color === Colors.BLACK ? 1 : -1
        const firstDirection = this.color === Colors.BLACK ? 2 : -2

        // same column
        if (fromCell.j === targetCell.j) {

            if (fromCell.i+direction === targetCell.i && board.getCell(fromCell.i+direction,targetCell.j).isEmpty()) return true

            if (this.isFirstTurn && (fromCell.i+firstDirection === targetCell.i) && board.getCell(fromCell.i+direction,targetCell.j).isEmpty() && board.getCell(fromCell.i+firstDirection,targetCell.j).isEmpty()) return true
            
            return false
        }
        // attack on enemy figures
        
        // if white attacks black
        if (this.color === Colors.WHITE) {
           if (fromCell.i-1 === targetCell.i && fromCell.j-1 === targetCell.j && fromCell.isEnemy(targetCell)) return true
           if (fromCell.i-1 === targetCell.i && fromCell.j+1 === targetCell.j && fromCell.isEnemy(targetCell)) return true
        }
        // if black attacks white
        if (this.color === Colors.BLACK) {
            if (fromCell.i+1 === targetCell.i && fromCell.j-1 === targetCell.j && fromCell.isEnemy(targetCell)) return true
            if (fromCell.i+1 === targetCell.i && fromCell.j+1 === targetCell.j && fromCell.isEnemy(targetCell)) return true
         }

        return false
    }

    public moveFigure(fromCell: Cell,targetCell:Cell,board:Board): void {
        this.isFirstTurn = false
        // RULE : When pawn reaches the end of the board,transform it to another fiqure(queen by defalt)
        if ((targetCell.i === 0 && this.color === Colors.WHITE) || (targetCell.i === 7 && this.color === Colors.BLACK)) {
            this.transformPawnToAnotherFiqure(fromCell,targetCell)
        }
    }

    public transformPawnToAnotherFiqure(fromCell : Cell,targetCell : Cell){
        const newFiqure = new Queen(this.color)
        targetCell.setFigure(newFiqure)
        fromCell.setFigure(null)
    }
}