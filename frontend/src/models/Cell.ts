import { Board } from "./Board";
import { Colors } from "./Colors";
import { Figure } from "./figures/Figure";
import {v4} from 'uuid'


export type availableCoordinates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export class Cell{
    readonly i : availableCoordinates;
    readonly j : availableCoordinates;
    readonly color : Colors;
    figure : Figure | null = null;
    board : Board;
    available : boolean;
    id : string;
    constructor(board:Board,i:availableCoordinates,j:availableCoordinates,color:Colors,figure:Figure | null){
        this.i = i; // row
        this.j = j; // column
        this.color = color;
        this.board = board;
        this.available = figure ? false : true
        this.id = v4()
    }

    public setFigure = (figure:Figure) => {
        this.figure = figure
        this.figure.cell = this
    }

    public moveFigure(target:Cell){
        if (this.figure && this.figure.canMove(target) ) {
            target.setFigure(this.figure)
            this.figure.moveFigure(target)
            this.figure = null
        }
    }

    public isEnemy(target:Cell) : boolean{
        if (target.figure){
            return this.figure?.color !== target.figure.color
        }
        return false
    }

    public isEmpty = () : boolean => {
        return this.figure === null
    }


    public isEmptyVertical(target:Cell) : boolean {
        // not the same column
        if (this.j !== target.j){
            return false
        }

        const min = Math.min(target.i,this.i)
        const max = Math.max(target.i,this.i)
        
        for (let i = min+1;i<max;i++) {
            if (!this.board.getCell(i,this.j).isEmpty()) {
                return false
            }
        }

        return true

    }

    public isEmptyDiagonal(target:Cell) : boolean {
        // main diagonal
        const absI = Math.abs(target.i-this.i)
        const absJ = Math.abs(target.j-this.j)
        // not a diagonal
        if (absI !== absJ) return false
        
        const IMove = this.i > target.i ? -1 : 1
        const JMove = this.j > target.j ? -1 : 1

        for (let index = 1;index<absJ;index++){
            if (!this.board.getCell(this.i + IMove*index,this.j + JMove*index).isEmpty()) return false
        }

        return true
    }

    public isEmptyHorizontal(target:Cell) : boolean {
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
}