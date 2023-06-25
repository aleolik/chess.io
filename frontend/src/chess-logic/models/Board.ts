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
    
    // get cell,where king is located(takes color as parametr;white-White King;black-Black king)
    public getKingCell(kingColor:Colors) : Cell{
        for (let i = 0;i<this.cells.length;i++){
            for (let j = 0;j<this.cells.length;j++){
                const cell = this.getCell(i,j)
                if (!cell.figure) continue
                if (cell.figure.name === FigureNames.KING && cell.figure.color === kingColor) return cell
            }
        }
        throw Error("King is must be at the board")
    }

    public initCells(){
        for (let i = 0;i<8;i++){
            const row : Cell[] = []
            for (let j = 0;j<8;j++){
                let index = i as availableCoordinates
                let jIndex = j as availableCoordinates
                if ((i + j) % 2 === 0){
                    row.push(new Cell(index,jIndex,Colors.WHITE,null))
                } else {
                    row.push(new Cell(index,jIndex,Colors.BLACK,null))
                }
            }
            this.cells.push(row);
        }
    }

    // CHECK on deepCopiedBoard if king will be under the attack if you make this turn.
    public kingWillBeUnderAttack(fromCell:Cell,targetCell:Cell,deepCopyBoard:Board) : boolean{
        if (!deepCopyBoard) {
            throw new Error("DeepCopyBoard can not be null in kingWillBeUnderAttack method!")
        }
        if (deepCopyBoard) {
            const fromCellInNewBoard = deepCopyBoard.getCell(fromCell.i,fromCell.j)    
            const targetCellInNewBoard = deepCopyBoard.getCell(targetCell.i,targetCell.j)

            if (!fromCellInNewBoard.figure) return true
            const figureInTargetBefore = targetCellInNewBoard.figure
            const figureThatIsMakingMove = fromCellInNewBoard.figure
            const cellWhereIsKing = deepCopyBoard.getKingCell(figureThatIsMakingMove.color)
            targetCellInNewBoard.figure = figureThatIsMakingMove
            fromCellInNewBoard.figure = null


            for (let i = 0 ;i<deepCopyBoard.cells.length;i++){
                for (let j = 0;j<deepCopyBoard.cells.length;j++) {
                    const cell = deepCopyBoard.getCell(i,j)
                    if (!cell.figure) continue
                    if (cell.figure.color === figureThatIsMakingMove.color) continue
                    if (cell.figure.canMove(cell,targetCellInNewBoard.figure instanceof King ? targetCellInNewBoard : cellWhereIsKing,deepCopyBoard)) {
                        // return state as before
                        fromCellInNewBoard.figure = figureThatIsMakingMove
                        targetCellInNewBoard.figure = figureInTargetBefore
                        return true
                    }
                }
            }

            // return state as before
            fromCellInNewBoard.figure = figureThatIsMakingMove
            targetCellInNewBoard.figure = figureInTargetBefore

            return false
        }
        
        return true
   }


    // highligt cells for user where he can move figure from selected cell.
    public highlightCells(selectedCell : Cell) {
        const deepCopyBoard = this.getDeepCopyBoard()
        for (let i = 0;i<this.cells.length;i++){
            const row = this.cells[i]
            for (let j = 0;j<row.length;j++) {
                const target = this.getCell(i,j)
                if (selectedCell.figure) {
                    this.cells[i][j].available = selectedCell.figure.canMove(selectedCell,target,this) && !deepCopyBoard.kingWillBeUnderAttack(selectedCell,target,deepCopyBoard)
                }
            }
        }
    }

    private kingIsUnderAttack(color:Colors) : boolean{
        const cellWhereIsKing = this.getKingCell(color)
        for (let i = 0;i<this.cells.length;i++){
            for (let j = 0;j<this.cells.length;j++){
                const cell = this.getCell(i,j)
                if (!cell.figure) continue;
                if (cell.figure.color === color) continue
                if (cell.figure.canMove(cell,cellWhereIsKing,this)) return true
            }
        }
        return false
    }

    private figureCanMovePrivate(selectedCell : Cell,deepCopyBoard:Board) : boolean {
        for (let i = 0;i<this.cells.length;i++){
            const row = this.cells[i]
            for (let j = 0;j<row.length;j++) {
                const target = this.getCell(i,j)
                if (selectedCell.figure) {
                    if (selectedCell.figure.canMove(selectedCell,target,deepCopyBoard) && !deepCopyBoard.kingWillBeUnderAttack(selectedCell,target,deepCopyBoard)) return true
                }
            }
        }
        return false
    }


    public isMate(color:Colors) : boolean{
        if (!this.kingIsUnderAttack(color)) return false
        const deepCopyBoard = this.getDeepCopyBoard()
        const cellWhereFiguresByColor : Cell[] = []
        for (let i = 0;i<this.cells.length;i++){
            const row = this.cells[i]
            for (let j = 0;j<row.length;j++) {
                const targetInDeepCopyBoard = deepCopyBoard.getCell(i,j)
                if (targetInDeepCopyBoard?.figure?.color !== color) continue
                cellWhereFiguresByColor.push(targetInDeepCopyBoard)
            }
        }

        for (let i = 0;i<cellWhereFiguresByColor.length;i++){
            const selectedCell = cellWhereFiguresByColor[i]
            for (let j = 0;j<this.cells.length;j++){
                for (let k = 0;k<this.cells.length;k++) {
                    const target = deepCopyBoard.getCell(j,k)
                    if (selectedCell.figure?.canMove(selectedCell,target,deepCopyBoard) && !deepCopyBoard.kingWillBeUnderAttack(selectedCell,target,deepCopyBoard)) return false
                }
            }
        }
        return true
    }


    private onlyKingsExistsOnTheBoard(){
        for (let i = 0;i<this.cells.length;i++){
            for (let j = 0 ;j<this.cells.length;j++){
                const cell = this.getCell(i,j)
                if (!cell.figure) continue
                if (!(cell.figure instanceof King)) return false
            }
        }

        return true
    }

    private playerCanMove(color:Colors) : boolean{
        const deepCopyBoard = this.getDeepCopyBoard()
        for (let i = 0;i<this.cells.length;i++){
            for (let j = 0 ;j<this.cells.length;j++){
                const cell = this.getCell(i,j)
                if (!cell.figure) continue
                if (cell.figure.color !== color) continue
                if (this.figureCanMovePrivate(cell,deepCopyBoard)) return true
            }
        }
        return false
    }
    
    public isTie(color:Colors) : boolean{
        // tie can be : king is under attack and no moves available or only 2 kings left on the board
        if (this.onlyKingsExistsOnTheBoard()) {
            return true
        }

        if (!this.playerCanMove(color)){
            return true
        }

        return false
    }

    // get deep copied version of the board (for deep check)
    public getDeepCopyBoard<T extends Board>() : T  {
        const newBoard = new Board() as T
        for (let i = 0;i<this.cells.length;i++){
            const cellArray : Cell[] = []
            for (let j = 0;j<this.cells[i].length;j++){
                const cellRefernce = this.cells[i][j]
                const cell = new Cell(cellRefernce.i,cellRefernce.j,cellRefernce.color,null)
                if (!cellRefernce.figure) {
                    cellArray.push(cell)
                    continue;
                }
                if (cellRefernce.figure.name === FigureNames.PAWN){
                    const newPawn = new Pawn(cellRefernce.figure.color)
                    cell.figure = newPawn
                }
                if (cellRefernce.figure.name === FigureNames.KING){
                    const newKing = new King(cellRefernce.figure.color)
                    cell.figure = newKing
                }
                if (cellRefernce.figure.name === FigureNames.BISHOP){
                    const newBishop = new Bishop(cellRefernce.figure.color)
                    cell.figure = newBishop
                }
                if (cellRefernce.figure.name === FigureNames.QUEEN){
                    const newQueen = new Queen(cellRefernce.figure.color)  
                    cell.figure = newQueen
                }
                if (cellRefernce.figure.name === FigureNames.HORSE){
                    const newHorse = new Horse(cellRefernce.figure.color)
                    cell.figure = newHorse
                }
                if (cellRefernce.figure.name === FigureNames.ROOK){
                    const newRook = new Rook(cellRefernce.figure.color)
                    cell.figure = newRook
                }
                cellArray.push(cell)
            }
            newBoard.cells.push(cellArray)
        }

        return newBoard 
        
      }

    // get new verison of the board,with the same cells in memory
    public getCopyBoard<T extends Board>() : T {
        const newBoard = new Board() as T
        newBoard.cells = this.cells
        return newBoard 
    }
    public getCell(i : number,j:number) : Cell{
        return this.cells[i][j] 
    }


    // add figures to board
    public addFigures() {
        this.addPawns()
        this.addHorses()
        this.addKings()
        this.addQueens()
        this.addBishops()
        this.addRooks()  
    }


   // add pawns to board
    private addPawns() {
        for (let j = 0;j< 8;j++){
            // black pawn
            this.cells[1][j].figure =  new Pawn(Colors.BLACK)
            // white pawn
            this.cells[6][j].figure = new Pawn(Colors.WHITE)
        }
    }

    // add kings to board
    private addKings() {
         // black king
         this.cells[0][3].figure =  new King(Colors.BLACK)
         // white king
         this.cells[7][3].figure = new King(Colors.WHITE)
    }

    // add queens to board
    private addQueens() {
         // black queen
         this.cells[0][4].figure =  new Queen(Colors.BLACK)
         // white queen
         this.cells[7][4].figure = new Queen(Colors.WHITE)
    }

    // add rooks to board
    private addRooks() {
         // black rooks
         this.cells[0][0].figure =  new Rook(Colors.BLACK)
         this.cells[0][7].figure =  new Rook(Colors.BLACK)
         // white rooks
         this.cells[7][0].figure = new Rook(Colors.WHITE)
         this.cells[7][7].figure = new Rook(Colors.WHITE)
    }

    // add bishops to board
    private addBishops() {
         // black horses
         this.cells[0][2].figure =  new Bishop(Colors.BLACK)
         this.cells[0][5].figure =  new Bishop(Colors.BLACK)
         // white horses
         this.cells[7][2].figure = new Bishop(Colors.WHITE)
         this.cells[7][5].figure = new Bishop(Colors.WHITE)

    }

    // add horses to board
    private addHorses() {
        this.cells[0][1].figure =  new Horse(Colors.BLACK)
        this.cells[0][6].figure =  new Horse(Colors.BLACK)
        // white horses
        this.cells[7][1].figure = new Horse(Colors.WHITE)
        this.cells[7][6].figure = new Horse(Colors.WHITE)
    }

    // check board's vertical
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

    // check board's diagonal
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

    // check board's horizontal
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