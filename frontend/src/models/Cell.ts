import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure } from "./figures/Figure";
import {v4} from 'uuid'
export class Cell{
    readonly i : number;
    readonly j : number;
    readonly color : Colors;
    figure : Figure | null = null;
    board : Board;
    available : boolean;
    id : string;
    constructor(board:Board,i:number,j:number,color:Colors,figure:Figure | null){
        this.i = i;
        this.j = j;
        this.color = color;
        this.board = board;
        this.available = figure ? false : true
        this.id = v4()
    }

    private setFigure = (figure:Figure) => {
        this.figure = figure
        this.figure.cell = this
    }

    public moveFigure(target:Cell){
        if (this.figure && this.figure.canMove(target) ) {
            this.figure.moveFigure(target)
            target.setFigure(this.figure)
            this.figure = null
        }
    }

    private isEmpty = () : boolean => {
        return this.figure === null
    }


    public isEmptyVertical(target:Cell) : boolean {
        // not the same row
        if (this.i !== target.i){
            return false
        }

        const min = Math.min(target.j,this.j)
        const max = Math.max(target.j,this.j)
        
        for (let j = min+1;j<max;j++) {
            if (!this.board.getCell(this.i,j).isEmpty()) {
                return false
            }
        }

        return true

    }

    public isEmptyDiagonal(target:Cell) : boolean {
        return true
    }

    public isEmptyHorizontal(target:Cell) : boolean {
        return true
    }
}