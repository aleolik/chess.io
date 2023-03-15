import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteHorse from '../../assets/whiteQueen.png'
import blackHorse from '../../assets/blackQueen.png'

export class Queen extends Figure{
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.QUEEN
        this.img = color === Colors.WHITE ? whiteHorse : blackHorse
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) return false;

        if (this.cell.isEmptyVertical(target)) return true;

        return false;
    }
}