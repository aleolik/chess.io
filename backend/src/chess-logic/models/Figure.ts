import { Colors } from "./Colors";
import { Cell } from "./Cell";
import { v4 } from "uuid";
import { Board } from "./Board";

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

    constructor(color:Colors){
        this.color = color
        this.name = FigureNames.DEFAULT
        this.id = v4()
    }

    findCellWhereIsKing(board:Board,color : Colors) : Cell{
        for (let i = 0;i<8;i++){
            for (let j = 0;j<8;j++){
                const figure = board.getCell(i,j).figure
                if (figure?.color !== color) continue
                if (figure.name !== FigureNames.KING) continue
                return board.getCell(i,j)
            }
        }
        throw new Error("King was not found!");
    }
    

    kingIsUnderAttack(target:Cell,deepCopyBoard:Board) : boolean{
        // console.log(deepCopyBoard)
        // const targetInNewBoard = deepCopyBoard.getCell(target.i,target.j)    
        // const thisInNewBoard = deepCopyBoard.getCell(this.cell.i,this.cell.j)

        // if (!thisInNewBoard.figure) throw new Error("Figure cant be null")

        // console.log(deepCopyBoard)

        // console.log(targetInNewBoard.i,targetInNewBoard.j)
        // targetInNewBoard.setFigure(thisInNewBoard.figure)
        // thisInNewBoard.figure = null

        // for (let i = 0;i<8;i++){
        //     for (let j = 0;j<8;j++){
        //         const cellInNewBoard = deepCopyBoard.getCell(i,j)
        //         if (!cellInNewBoard.figure) continue
        //         if (cellInNewBoard.figure?.color === this.color) continue
        //         if (cellInNewBoard.figure?.canMove(thisInNewBoard,deepCopyBoard,false)) return true
        //     }
        // }

        return false
   }

    canMove(fromCell:Cell,targetCell:Cell,board:Board) : boolean{
        // RULE : Can not attack your's figures
        if (targetCell.figure && targetCell.figure.color === fromCell.figure.color) {
            return false
        }
        // RULE : MATE
        if (targetCell.figure?.name === FigureNames.KING) {
            return false
        }
    
        return true;
    }

    moveFigure(fromCell:Cell,targetCell:Cell,board:Board){
       
    }
}