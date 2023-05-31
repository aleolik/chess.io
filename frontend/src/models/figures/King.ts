import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteKing from '../../assets/whiteKing.png'
import blackKing from '../../assets/blackKing.png'

export class King extends Figure{
    canSwapWithRook = true
    doSwap = false
    constructor(color:Colors,cell:Cell){
        super(color,cell)
        this.name = FigureNames.KING
        this.img = color === Colors.WHITE ? whiteKing : blackKing
    }

    isEmptyVertical(target:Cell) : boolean{
        if (this.cell.j !== target.j) return false
        if (target.figure && target.figure.color === this.color) return false
        return (this.cell.i+1 === target.i) || (this.cell.i -1 === target.i)
    }
    isEmptyHorizontal(target:Cell) : boolean{
        if (this.cell.i !== target.i) return false
        if (target.figure && target.figure.color === this.color) return false
        return this.cell.j+1 === target.j || this.cell.j - 1 === target.j
    }

    isEmptyDiagonal(target:Cell) : boolean{
        if (target.figure && target.figure.color === this.color) return false
        if (this.cell.i-1 === target.i && (this.cell.j-1 === target.j || this.cell.j+1 === target.j)
        || (this.cell.i+1 === target.i && (this.cell.j-1 === target.j || this.cell.j+1 === target.j))) return true
        return false 
    }
    
    swapWithRook(target:Cell) : boolean{
        if (!this.canSwapWithRook) return false
        
        // swap with rooks on the left
        const leftTopCell = target.board.getCell(0,0)
        const leftBottomCell = target.board.getCell(7,0)
        // swap with rooks on the right
        const rightTopCell = target.board.getCell(0,7)
        const rightBottomCell = target.board.getCell(7,7)

        // flags
        let canSwapWithLeftBlackRook = true
        let canSwapWithLeftWhiteRook = true
        let canSwapWithRightWhiteRook = true
        let canSwapWithRightBlackRook = true

        for (let i = 1;i<3;i++){
            const cellForBlack = target.board.getCell(0,i)
            const cellForWhite = target.board.getCell(7,i)

            if (cellForBlack.figure) {
                canSwapWithLeftBlackRook = false
            }
            if (cellForWhite.figure) {
                canSwapWithLeftWhiteRook = false
            }
        }
        for (let i = 4;i<7;i++){
            const cellForBlack = target.board.getCell(0,i)
            const cellForWhite = target.board.getCell(7,i)

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

    kingCanMove(target:Cell) : boolean{
        return true
    }

    canMove(target: Cell): boolean {
        this.doSwap = false
        // can not attack king
        if (target.figure?.name === FigureNames.KING) {
            return false
        }

        if (this.isEmptyVertical(target))  return this.kingCanMove(target)

        if (this.isEmptyHorizontal(target)) return this.kingCanMove(target)

        if (this.isEmptyDiagonal(target))  return this.kingCanMove(target)

        // RULE : You can swap with your's rook if every statement are true
        if ((this.name === FigureNames.KING && target.figure && target.figure.name === FigureNames.ROOK) && (target.figure.color === this.color)) {
            if (this.swapWithRook(target)) {
                if (this.kingCanMove(target)){
                    this.doSwap = true
                    return true
                }
            }
        }



        return false;
    }

    moveFigure(target: Cell): void {
        this.canSwapWithRook = false
        if (this.doSwap) {
            const rook = target.figure
            if (!rook) return;
            if (rook.color !== this.color) return;
            
            // swap with white rooks
            if (rook.color === Colors.WHITE) {
                // left rook
                if (rook.cell.j === 0) {
                    // short swap
                    const newCellForKing = this.cell.board.getCell(7,1)
                    const newCellForRook = this.cell.board.getCell(7,2)
                    newCellForKing.setFigure(this)
                    newCellForRook.setFigure(rook)
                }
                // right rook
                else {
                    const newCellForKing = this.cell.board.getCell(7,5)
                    const newCellForRook = this.cell.board.getCell(7,4)
                    newCellForKing.setFigure(this)
                    newCellForRook.setFigure(rook)
                }
            }

            // swap with black rooks
            if (rook.color === Colors.BLACK) {
                if (rook.cell.j === 0) {
                    // short swap
                    const newCellForKing = this.cell.board.getCell(0,1)
                    const newCellForRook = this.cell.board.getCell(0,2)
                    newCellForKing.setFigure(this)
                    newCellForRook.setFigure(rook)
                }
                // right rook
                else {
                    const newCellForKing = this.cell.board.getCell(0,5)
                    const newCellForRook = this.cell.board.getCell(0,4)
                    newCellForKing.setFigure(this)
                    newCellForRook.setFigure(rook)
                }
            }
        }
    }

}