import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whitePawn from '../../assets/whitePawn.png'
import blackPawn from '../../assets/blackPawn.png'
import { Queen } from "./Queen";

export class Pawn extends Figure{

    isFirstTurn : boolean = true

    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.PAWN
        this.img = color === Colors.WHITE ? whitePawn : blackPawn
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }
        // BLACK = MOVE TO BOTTOM,WHITE = MOVE TO TOP
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1
        const firstDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2

        // same column
        if (this.cell.j === target.j) {

            if (this.cell.i+direction === target.i && target.board.getCell(this.cell.i+direction,target.j).isEmpty()) return true

            if (this.isFirstTurn && (this.cell.i+firstDirection === target.i) && target.board.getCell(this.cell.i+direction,target.j).isEmpty() && target.board.getCell(this.cell.i+firstDirection,target.j).isEmpty()) return true
            
            return false
        }
        // attack on enemy figures
        
        // if white attacks black
        if (this.cell.figure?.color === Colors.WHITE) {
           if (this.cell.i-1 === target.i && this.cell.j-1 === target.j && this.cell.isEnemy(target)) return true
           if (this.cell.i-1 === target.i && this.cell.j+1 === target.j && this.cell.isEnemy(target)) return true
        }
        // if black attacks white
        if (this.cell.figure?.color === Colors.BLACK) {
            if (this.cell.i+1 === target.i && this.cell.j-1 === target.j && this.cell.isEnemy(target)) return true
            if (this.cell.i+1 === target.i && this.cell.j+1 === target.j && this.cell.isEnemy(target)) return true
         }

        return false
    }

    public moveFigure(target: Cell): void {
        this.isFirstTurn = false
        super.moveFigure(target)
        // RULE : When pawn reaches the end of the board,transform it to another fiqure(queen by defalt)
        if ((target.i === 0 && this.color === Colors.WHITE) || (target.i === 7 && this.color === Colors.BLACK)) {
            this.transformPawnToAnotherFiqure(target,this.color)
        }
    }

    public transformPawnToAnotherFiqure(target:Cell,color:Colors){
        // RULE : When pawn reaches the end of the board,transform it to another fiqure(queen by defalt)
        const newFiqure = new Queen(this.color,target)
        target.setFigure(newFiqure)
    }
}