import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whitePawn from '../../assets/whitePawn.png'
import blackPawn from '../../assets/blackPawn.png'

export class Pawn extends Figure{
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.PAWN
        this.img = color === Colors.WHITE ? whitePawn : blackPawn
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }

        return true;
    }
}