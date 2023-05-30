import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteKing from '../../assets/whiteKing.png'
import blackKing from '../../assets/blackKing.png'

export class King extends Figure{
    canSwapWithRook = true
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.KING
        this.img = color === Colors.WHITE ? whiteKing : blackKing
    }

    isEmptyVertical(target:Cell) : boolean{
        if (this.cell.j !== target.j) return false
        return (this.cell.i+1 === target.i) || (this.cell.i -1 === target.i)
    }
    isEmptyHorizontal(target:Cell) : boolean{
        if (this.cell.i !== target.i) return false
        return this.cell.j+1 === target.j || this.cell.j - 1 === target.j
    }

    isEmptyDiagonal(target:Cell) : boolean{
        if (this.cell.i-1 === target.i && (this.cell.j-1 === target.j || this.cell.j+1 === target.j)
        || (this.cell.i+1 === target.i && (this.cell.j-1 === target.j || this.cell.j+1 === target.j))) return true
        return false 
    }

    checkKingForCheck(target:Cell) : boolean{
        return true
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }

        if (this.isEmptyVertical(target))  return this.checkKingForCheck(target)

        if (this.isEmptyHorizontal(target))  return this.checkKingForCheck(target)

       if (this.isEmptyDiagonal(target))  return this.checkKingForCheck(target)

        return false;
    }

    moveFigure(target: Cell): void {
        super.moveFigure(target)
        this.canSwapWithRook = false
    }

}