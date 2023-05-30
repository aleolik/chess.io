import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteRook from '../../assets/whiteRook.png'
import blackRook from '../../assets/blackRook.png'


export class Rook extends Figure{
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.ROOK
        this.img = color === Colors.WHITE ? whiteRook : blackRook
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }

        if (this.cell.isEmptyHorizontal(target)) return true

        if (this.cell.isEmptyVertical(target)) return true

        return false;
    }

}