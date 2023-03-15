import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import blackBishop from '../../assets/blackBishop.png'
import whiteBishop from '../../assets/whiteBishop.png'

export class Bishop extends Figure{
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.img = color === Colors.WHITE ? whiteBishop : blackBishop
        this.name = FigureNames.BISHOP
    }


    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }

        return true
    }

}