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

    public canProtectKing(fromCell : Cell,targetCell : Cell,color:Colors,deepCopyBoard:Board) : boolean{
        const targetInDeepCopiedBoard = deepCopyBoard.getCell(targetCell.i,targetCell.j)
        const fromInDeepCopiedBoard = deepCopyBoard.getCell(fromCell.i,fromCell.j)
        targetInDeepCopiedBoard.figure = fromCell.figure
        fromInDeepCopiedBoard.figure = null
        const cellWhereIsKing = deepCopyBoard.getKingCell(color)
        for (let i = 0 ;i<deepCopyBoard.cells.length;i++){
            for (let j = 0;j<deepCopyBoard.cells.length;j++) {
                const cell = deepCopyBoard.getCell(i,j)
                if (!cell.figure) continue
                if (cell.figure.color === color) continue
                if (cell.figure.canMove(cell,cellWhereIsKing,deepCopyBoard)) {
                    return false
                }
            }
        }
        return true
    }
    
    // TODO : RE-DO kingWillBeUnderAttack and KingIsUnderAttack methods in this method,so you don't need to call it elsewhere
    canMove(fromCell:Cell,targetCell:Cell,board:Board) : boolean{
        // RULE : Can not attack your's figures
        if (targetCell.figure && targetCell.figure.color === fromCell?.figure?.color) return false
        
        // if (this.kingWillBeUnderAttack(fromCell,targetCell,board,deepCopyBoard)) return false


        return true;
    }

    moveFigure(fromCell:Cell,targetCell:Cell,board:Board) : void{
        targetCell.figure = fromCell.figure
        fromCell.figure = null
    }

}