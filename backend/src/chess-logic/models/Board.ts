import { v4 } from "uuid"
import { Cell, availableCoordinates } from "./Cell"
import { Colors } from "./Colors"
import { Bishop } from "../figures/Bishop"
import { Horse } from "../figures/Horse"
import { King } from "../figures/King"
import { Pawn } from "../figures/Pawn"
import { Queen } from "../figures/Queen"
import { Rook } from "../figures/Rook"
import { FigureNames } from "./Figure"
export class Board {
    cells : Cell[][] = []
    id : string;
    
    constructor(){
        this.id = v4()
    }
    
    public initCells(){
        for (let i = 0;i<8;i++){
            const row : Cell[] = []
            for (let j = 0;j<8;j++){
                let index = i as availableCoordinates
                let jIndex = j as availableCoordinates
                if ((i + j) % 2 === 0){
                    row.push(new Cell(this,index,jIndex,Colors.WHITE,null))
                } else {
                    row.push(new Cell(this,index,jIndex,Colors.BLACK,null))
                }
            }
            this.cells.push(row);
        }
    }

    public highlightCells(selectedCell : Cell) {
        for (let i = 0;i<this.cells.length;i++){
            const row = this.cells[i]
            for (let j = 0;j<row.length;j++) {
                const target = this.cells[i][j]
                if (selectedCell.figure) {
                    this.cells[i][j].available = selectedCell.figure.canMove(selectedCell,target,this)
                }
            }
        }
    }
    // public getDeepCopyBoard<T extends Board>() : T  {
    //     const newBoard = new Board() as T
    //     for (let i = 0;i<this.cells.length;i++){
    //         const cellArray : Cell[] = []
    //         for (let j = 0;j<this.cells[i].length;j++){
    //             const cellRefernce = this.cells[i][j]
    //             const cell = new Cell(newBoard,cellRefernce.i,cellRefernce.j,cellRefernce.color,null)
    //             if (!cellRefernce.figure) {
    //                 cellArray.push(cell)
    //                 continue;
    //             }
    //             if (cellRefernce.figure.name === FigureNames.PAWN){
    //                 const newPawn = new Pawn(cellRefernce.figure.color,cell)
    //                 cell.setFigure(newPawn)
    //             }
    //             if (cellRefernce.figure.name === FigureNames.KING){
    //                 const newKing = new King(cellRefernce.figure.color,cell)
    //                 cell.setFigure(newKing)
    //             }
    //             if (cellRefernce.figure.name === FigureNames.BISHOP){
    //                 const newBishop = new Bishop(cellRefernce.figure.color,cell)
    //                 cell.setFigure(newBishop)
    //             }
    //             if (cellRefernce.figure.name === FigureNames.QUEEN){
    //                 const newQueen = new Queen(cellRefernce.figure.color,cell)  
    //                 cell.setFigure(newQueen)
    //             }
    //             if (cellRefernce.figure.name === FigureNames.HORSE){
    //                 const newHorse = new Horse(cellRefernce.figure.color,cell)
    //                 cell.setFigure(newHorse)
    //             }
    //             if (cellRefernce.figure.name === FigureNames.ROOK){
    //                 const newRook = new Rook(cellRefernce.figure.color,cell)
    //                 cell.setFigure(newRook)
    //             }
    //             cellArray.push(cell)
    //         }
    //         newBoard.cells.push(cellArray)
    //     }

    //     return newBoard 
        
    //   }

    public getCopyBoard<T extends Board>() : T {
        const newBoard = new Board() as T
        newBoard.cells = this.cells
        return newBoard 
    }
    public getCell(i : number,j:number) : Cell{
        return this.cells[i][j] 
    }

    public addFigures() {
        this.addPawns()
        this.addHorses()
        this.addKings()
        this.addQueens()
        this.addBishops()
        this.addRooks()
        this.addHorses()    
    }

    private addPawns() {
        for (let j = 0;j< 8;j++){
            // black pawn
            this.cells[1][j].figure =  new Pawn(Colors.BLACK)
            // white pawn
            this.cells[6][j].figure = new Pawn(Colors.WHITE)
        }
    }

    private addKings() {
         // black king
         this.cells[0][3].figure =  new King(Colors.BLACK)
         // white king
         this.cells[7][3].figure = new King(Colors.WHITE)
    }

    private addQueens() {
         // black queen
         this.cells[0][4].figure =  new Queen(Colors.BLACK)
         // white queen
         this.cells[7][4].figure = new Queen(Colors.WHITE)
    }

    private addRooks() {
         // black rooks
         this.cells[0][0].figure =  new Rook(Colors.BLACK)
         this.cells[0][7].figure =  new Rook(Colors.BLACK)
         // white rooks
         this.cells[7][0].figure = new Rook(Colors.WHITE)
         this.cells[7][7].figure = new Rook(Colors.WHITE)
    }


    private addBishops() {
         // black horses
         this.cells[0][2].figure =  new Bishop(Colors.BLACK)
         this.cells[0][5].figure =  new Bishop(Colors.BLACK)
         // white horses
         this.cells[7][2].figure = new Bishop(Colors.WHITE)
         this.cells[7][5].figure = new Bishop(Colors.WHITE)

    }

    private addHorses() {
        this.cells[0][1].figure =  new Horse(Colors.BLACK)
        this.cells[0][6].figure =  new Horse(Colors.BLACK)
        // white horses
        this.cells[7][1].figure = new Horse(Colors.WHITE)
        this.cells[7][6].figure = new Horse(Colors.WHITE)
    }


    public isEmptyVertical(fromCell:Cell,targetCell:Cell) : boolean {
        // not the same column
        if (fromCell.j !== targetCell.j){
            return false
        }

        const min = Math.min(targetCell.i,fromCell.i)
        const max = Math.max(targetCell.i,fromCell.i)
        
        for (let i = min+1;i<max;i++) {
            if (!this.getCell(i,targetCell.j).isEmpty()) {
                return false
            }
        }

        return true
    }

    public isEmptyDiagonal(fromCell:Cell,targetCell:Cell) : boolean {
        // main diagonal
        const absI = Math.abs(targetCell.i-fromCell.i)
        const absJ = Math.abs(targetCell.j-fromCell.j)
        // not a diagonal
        if (absI !== absJ) return false
        
        const IMove = fromCell.i > targetCell.i ? -1 : 1
        const JMove = fromCell.j > targetCell.j ? -1 : 1

        for (let index = 1;index<absJ;index++){
            if (!this.getCell(fromCell.i + IMove*index,fromCell.j + JMove*index).isEmpty()) return false
        }

        return true
    }

    public isEmptyHorizontal(fromCell:Cell,targetCell:Cell) : boolean {
        // not the same row
         if (fromCell.i !== targetCell.i){
             return false
         }
 
         const min = Math.min(targetCell.j,fromCell.j)
         const max = Math.max(targetCell.j,fromCell.j)
 
         for (let j = min+1;j<max;j++) {
             if (!this.getCell(fromCell.i,j).isEmpty()) {
                 return false
             }
         }
 
         return true
     }
}