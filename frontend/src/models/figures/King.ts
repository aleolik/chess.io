import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteKing from '../../assets/whiteKing.png'
import blackKing from '../../assets/blackKing.png'

export class King extends Figure{
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.KING
        this.img = color === Colors.WHITE ? whiteKing : blackKing
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }

        return true;
    }

}