import { Colors } from "./Colors";
import { Cell } from "./Cell";
import { v4 } from "uuid";
import { Board } from "./Board";
import imgExample from '../chess-assets/blackBishop.png'

export enum FigureNames{
    "DEFAULT" = "default",
    "KING"= "KING",
    "QUEEN" = "QUEEN",
    "PAWN" = "PAWN",
    "BISHOP" = "BISHOP",
    "ROOK" = "ROOK",
    "HORSE" = "HORSE"
}

export class Figure{
    color: Colors;
    id : string;
    name : FigureNames;
    img : typeof imgExample | null = null

    constructor(color:Colors){
        this.color = color
        this.name = FigureNames.DEFAULT
        this.id = v4()
    }

    // public canProtectKing(color:Colors,amount:number,board:Board,fromCell:Cell) : boolean{
    //     // amount > 1 means you can only escape if king can go on other cell
    //     if (amount > 1) return false
    //     const cellFromWhereFigureIsAttacking = board.findCellFromWhereFigureIsAttacking(amount,color)
    //     return this.canMove(fromCell,cellFromWhereFigureIsAttacking,board)
    // }
    

    public kingIsUnderAttack(board:Board){

    }
    public kingWillBeUnderAttack(fromCell:Cell,targetCell:Cell,board:Board,deepCopyBoard:Board) : boolean{
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
                    if (cell.figure.canMove(cell,cellWhereIsKing,board,deepCopyBoard)) {
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

            console.log(cellWhereIsKing)

            return false
        }
        
        return true


   }

    canMove(fromCell:Cell,targetCell:Cell,board:Board,deepCopyBoard : Board) : boolean{
        // RULE : Can not attack your's figures
        if (targetCell.figure && targetCell.figure.color === fromCell?.figure?.color) return false
        
        if (this.kingWillBeUnderAttack(fromCell,targetCell,board,deepCopyBoard)) return false


        return true;
    }

    moveFigure(fromCell:Cell,targetCell:Cell,board:Board) : void{
        targetCell.figure = fromCell.figure
        fromCell.figure = null
    }

}