import { Cell } from "./Cell"
import { Colors } from "./Colors"
import { Bishop } from "./figures/Bishop"
import { Horse } from "./figures/Horse"
import { King } from "./figures/King"
import { Pawn } from "./figures/Pawn"
import { Queen } from "./figures/Queen"
import { Rook } from "./figures/Rook"
export class Board {
    cells : Cell[][] = []

    public initCells(){
        for (let i = 0;i<8;i++){
            const row : Cell[] = []
            for (let j = 0;j<8;j++){
                if ((i + j) % 2 === 0){
                    row.push(new Cell(this,i,j,Colors.WHITE,null))
                } else {
                    row.push(new Cell(this,i,j,Colors.BLACK,null))
                }
            }
            this.cells.push(row);
        }
    }

    public highlightCells(selectedCell : Cell | null) {
        for (let i = 0;i<this.cells.length;i++){
            const row = this.cells[i]
            for (let j = 0;j<row.length;j++) {
                const target = this.cells[i][j]
                if (selectedCell?.figure) {
                    this.cells[i][j].available = selectedCell.figure.canMove(target)
                }
            }
        }
    }

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
        for (let i = 0;i< 8;i++){
            // black pawn
            new Pawn(Colors.BLACK,this.getCell(1,i))
            // white pawn
            new Pawn(Colors.WHITE,this.getCell(6,i))
        }
    }

    private addKings() {
        // black king
        new King(Colors.BLACK,this.getCell(0,3))
        // white king
        new King(Colors.WHITE,this.getCell(7,3))
    }

    private addQueens() {
        // black queen
        new Queen(Colors.BLACK,this.getCell(0,4))
        // white queen
        new Queen(Colors.WHITE,this.getCell(7,4))
    }

    private addRooks() {
        // black rooks
        new Rook(Colors.BLACK,this.getCell(0,0))
        new Rook(Colors.BLACK,this.getCell(0,7))
        // white rooks
        new Rook(Colors.WHITE,this.getCell(7,0))
        new Rook(Colors.WHITE,this.getCell(7,7))
    }


    private addBishops() {
          // black bishops
          new Bishop(Colors.BLACK,this.getCell(0,2))
          new Bishop(Colors.BLACK,this.getCell(0,5))
          // white bishops
          new Bishop(Colors.WHITE,this.getCell(7,2))
          new Bishop(Colors.WHITE,this.getCell(7,5))
    }

    private addHorses() {
         // black horses
         new Horse(Colors.BLACK,this.getCell(0,1))
         new Horse(Colors.BLACK,this.getCell(0,6))
         // white horses
         new Horse(Colors.WHITE,this.getCell(7,1))
         new Horse(Colors.WHITE,this.getCell(7,6))
    }
}