import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteHorse from '../../assets/whiteHorse.png'
import blackHorse from '../../assets/blackHorse.png'

export class Horse extends Figure{
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.HORSE
        this.img = color === Colors.WHITE ? whiteHorse : blackHorse
    }

    canMove(target: Cell): boolean {
        if (!super.canMove(target)) {
            return false
        }

        return true;
    }

}