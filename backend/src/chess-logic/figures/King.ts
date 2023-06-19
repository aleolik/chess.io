import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { Figure, FigureNames } from "../models/Figure";
import { Board } from "../models/Board";
import { Rook } from "./Rook";

export class King extends Figure{
    canSwapWithRook = true
    doSwap = false
    constructor(color:Colors){
        super(color)
        this.name = FigureNames.KING
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
        if (fromCell.i-1 === targetCell.i && (fromCell.j-1 === targetCell.j || fromCell.j+1 === targetCell.j)
        || (fromCell.i+1 === targetCell.i && (fromCell.j-1 === targetCell.j || fromCell.j+1 === targetCell.j))) return true
        return false 
    }
    
    swapWithRook(fromCell:Cell,target:Cell,board:Board) : boolean{
        if (!this.canSwapWithRook) return false
        
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

    findNewCellByCastle(fromCell : Cell,targetCell:Cell,board:Board) : Cell{
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
    canMove(fromCell:Cell,targetCell:Cell,board:Board): boolean {
        this.doSwap = false
        // can not attack king
        if (targetCell.figure.name === FigureNames.KING) {
            return false
        }

        if (board.isEmptyVertical(fromCell,targetCell))  return true

        if (board.isEmptyHorizontal(fromCell,targetCell)) return true

        if (board.isEmptyDiagonal(fromCell,targetCell))  return  true

        // RULE : You can swap with your's rook if every statement are true
        if ((this.name === FigureNames.KING && targetCell.figure && targetCell.figure.name === FigureNames.ROOK) && (targetCell.figure.color === this.color)) {
            if (this.swapWithRook(fromCell,targetCell,board)) {
                // find cell,after the swap with rook,that king will be moved in
                const newKingCell = this.findNewCellByCastle(fromCell,targetCell,board)
                this.doSwap = true
                return true
            }
        }



        return false;
    }

    moveFigure(fromCell:Cell,targetCell:Cell,board:Board): void {
        super.moveFigure(fromCell,targetCell,board)
        this.canSwapWithRook = false
        if (this.doSwap) {
            const rook = targetCell.figure as Rook
            if (rook.color !== this.color) return;
            
            const newCellForKing = this.findNewCellByCastle(fromCell,targetCell,board)
            // swap with white rooks
            if (rook.color === Colors.WHITE) {
                // left rook
                if (targetCell.j === 0) {
                    // short swap
                    const newCellForRook = board.getCell(7,2)
                    newCellForRook.setFigure(rook)
                }
                // right rook
                else {
                    const newCellForRook = board.getCell(7,4)
                    newCellForRook.setFigure(rook)
                }
            }

            // swap with black rooks
            if (rook.color === Colors.BLACK) {
                if (targetCell.j === 0) {
                    // short swap
                    const newCellForRook = board.getCell(0,2)
                    newCellForRook.setFigure(rook)
                }
                // right rook
                else {
                    const newCellForRook = board.getCell(0,4)
                    newCellForRook.setFigure(rook)
                }
            }
            newCellForKing.setFigure(this)
        }
    }

}