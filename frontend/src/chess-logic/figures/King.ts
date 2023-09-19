import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";
import { Rook } from "./Rook";
import whiteKing from '../chess-assets/whiteKing.png'
import blackKing from '../chess-assets/blackKing.png'
import { v4 } from "uuid";

export class King extends Figure{
    canSwap : boolean = true
    constructor(color:Colors,canSwap : boolean = true,figureId? : string){
        super(color,figureId ? figureId : v4())
        this.name = FigureNames.KING
        this.img = color === Colors.WHITE ? whiteKing : blackKing
        this.canSwap = canSwap ? canSwap : true
    }

    isEmptyVertical(fromCell:Cell,targetCell:Cell) : boolean{
        if (fromCell.j !== targetCell.j) return false
        if (targetCell.figure && targetCell.figure.color === this.color) return false
        return (fromCell.i+1 === targetCell.i) || (fromCell.i -1 === targetCell.i)
    }
    isEmptyHorizontal(fromCell:Cell,targetCell:Cell) : boolean{
        if (fromCell.i !== targetCell.i) return false
        if (targetCell.figure && targetCell.figure.color === this.color) return false
        return fromCell.j+1 === targetCell.j || fromCell.j - 1 === targetCell.j
    }

    isEmptyDiagonal(fromCell:Cell,targetCell:Cell) : boolean{
        if (targetCell.figure && targetCell.figure.color === this.color) return false
        if ((fromCell.i-1 === targetCell.i && (fromCell.j-1 === targetCell.j || fromCell.j+1 === targetCell.j))
        || ((fromCell.i+1 === targetCell.i && (fromCell.j-1 === targetCell.j || fromCell.j+1 === targetCell.j)))) return true
        return false 
    }
    
    canSwapWithRook(fromCell:Cell,target:Cell,board:Board) : boolean{
        if (!this.canSwap) return false

        // king is not under attack
        const cellWhereIsKing  = board.getKingCell(this.color)
        for (let i = 0;i<board.cells.length;i++){
            for (let j = 0;j<board.cells.length;j++){
                const cell = board.getCell(i,j)
                if (!cell.figure) continue
                if (cell.figure.color === this.color) continue
                if (cell.figure.canMove(cell,cellWhereIsKing,board)) return false
            }
        }
        
        // swap with rooks on the left
        const leftTopCell = board.getCell(0,0)
        const leftBottomCell = board.getCell(7,0)
        // swap with rooks on the right
        const rightTopCell = board.getCell(0,7)
        const rightBottomCell = board.getCell(7,7)

        // flags
        let canSwapWithLeftBlackRook = true
        let canSwapWithLeftWhiteRook = true
        let canSwapWithRightWhiteRook = true
        let canSwapWithRightBlackRook = true

        for (let i = 1;i<3;i++){
            const cellForBlack = board.getCell(0,i)
            const cellForWhite = board.getCell(7,i)

            if (cellForBlack.figure) {
                canSwapWithLeftBlackRook = false
            }
            if (cellForWhite.figure) {
                canSwapWithLeftWhiteRook = false
            }
        }
        for (let i = 4;i<7;i++){
            const cellForBlack = board.getCell(0,i)
            const cellForWhite = board.getCell(7,i)

            if (cellForBlack.figure) {
                canSwapWithRightBlackRook = false
            }
            if (cellForWhite.figure) {
                canSwapWithRightWhiteRook = false
            }
        }

        if (canSwapWithLeftBlackRook || canSwapWithLeftWhiteRook){
            if (canSwapWithLeftBlackRook) {
                if (target.i === leftTopCell.i && target.j === leftTopCell.j && leftTopCell.figure && leftTopCell.figure.name === FigureNames.ROOK && leftTopCell.figure.color === Colors.BLACK) return true
            }
            if (canSwapWithLeftWhiteRook) {
                if (target.i === leftBottomCell.i && target.j === leftBottomCell.j && leftBottomCell.figure && leftBottomCell.figure.name === FigureNames.ROOK && leftBottomCell.figure.color === Colors.WHITE) return true
            }
        }
        if (canSwapWithRightBlackRook || canSwapWithRightWhiteRook){
            if (canSwapWithRightBlackRook) {
                if (target.i === rightTopCell.i && target.j === rightTopCell.j && rightTopCell.figure && rightTopCell.figure.name === FigureNames.ROOK && rightTopCell.figure.color === Colors.BLACK) return true
            }
            if (canSwapWithRightWhiteRook) {
                if (target.i === rightBottomCell.i && target.j === rightBottomCell.j && rightBottomCell.figure && rightBottomCell.figure.name === FigureNames.ROOK && rightBottomCell.figure.color === Colors.WHITE) return true
            }
        }
        return false
    }

    findNewCellForKingWhenCastle(fromCell : Cell,targetCell:Cell,board:Board) : Cell{
        const rook = targetCell.figure as Rook
        // swap with white rooks
        if (rook.color === Colors.WHITE) {
            // left rook
            if (targetCell.j === 0) {
                // short swap
                return board.getCell(7,1)
            }
            // right rook
            else {
                return board.getCell(7,5)
            }
        }
        // swap with black rooks
        else {
            if (targetCell.j === 0) {
                // short swap
                return board.getCell(0,1)
            }
            // right rook
            else {
                return board.getCell(0,5)
            }
        }
    }

    findNewCellForRookWhenCastle(fromCell : Cell,targetCell:Cell,board:Board) : Cell{
        const rook = targetCell.figure as Rook
        // swap with white rooks
        if (rook.color === Colors.WHITE) {
            // left rook
            if (targetCell.j === 0) {
                // short swap
                const newCellForRook = board.getCell(7,2)
                return newCellForRook
            }
            // right rook
            else {
                const newCellForRook = board.getCell(7,4)
                return newCellForRook
            }
        } else {
            // swap with black rooks
            if (targetCell.j === 0) {
                // short swap
                const newCellForRook = board.getCell(0,2)
                return newCellForRook
            }
            // right rook
            else {
                const newCellForRook = board.getCell(0,4)
                return newCellForRook
            }
        }

    }
    canMove(fromCell:Cell,targetCell:Cell,board:Board): boolean {
        if (!super.canMove(fromCell,targetCell,board) && !(targetCell.figure instanceof Rook && fromCell.figure instanceof King && targetCell.figure.color === fromCell.figure.color)) return false
        if (targetCell.figure && targetCell.figure.color === fromCell?.figure?.color) {
            // rule : swap
            if (!(targetCell.figure instanceof Rook)) {
                return false
            }
        }

        if (this.isEmptyVertical(fromCell,targetCell))  return true

        if (this.isEmptyHorizontal(fromCell,targetCell)) return true

        if (this.isEmptyDiagonal(fromCell,targetCell))  return  true

        // RULE : You can swap with your's rook if every statement are true
        if ((this.name === FigureNames.KING && targetCell.figure && targetCell.figure.name === FigureNames.ROOK) && this.canSwap && (targetCell.figure.color === this.color)) {
            if (this.canSwapWithRook(fromCell,targetCell,board)) {
                // find cell,after the swap with rook,that king will be moved in
                return true
            }
        }



        return false;
    }

    moveFigure(fromCell:Cell,targetCell:Cell,board:Board,doSwap : boolean = false): void {
        if (this.canSwap && doSwap) {
            const rook = targetCell.figure as Rook
            if (rook.color !== this.color) return;
            
            const newCellForKing = this.findNewCellForKingWhenCastle(fromCell,targetCell,board)
            const newCellForRook = this.findNewCellForRookWhenCastle(fromCell,targetCell,board)
            newCellForRook.figure = rook
            newCellForKing.figure = this
            targetCell.figure = null
            fromCell.figure = null
        } else {
            super.moveFigure(fromCell,targetCell,board)
        }
        // king moved,so you can't castle  anymore
        this.canSwap = false
    }

}