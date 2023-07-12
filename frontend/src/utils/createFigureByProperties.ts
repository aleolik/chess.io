import { Bishop } from "../chess-logic/figures/Bishop";
import { Horse } from "../chess-logic/figures/Horse";
import { King } from "../chess-logic/figures/King";
import { Pawn } from "../chess-logic/figures/Pawn";
import { Queen } from "../chess-logic/figures/Queen";
import { Rook } from "../chess-logic/figures/Rook";
import { Colors } from "../chess-logic/models/Colors";
import { Figure, FigureNames } from "../chess-logic/models/Figure";

export const createFigureByProperties = (figureName : string,figureColor:Colors) : Figure | null => {
    if (figureName === FigureNames.ROOK){
        return new Rook(figureColor)
    }
    if (figureName === FigureNames.PAWN){
        return new Pawn(figureColor)
    }
    if (figureName === FigureNames.HORSE){
        return new Horse(figureColor)
    }
    if (figureName === FigureNames.BISHOP){
        return new Bishop(figureColor)
    }
    if (figureName === FigureNames.KING){
        return new King(figureColor)
    }
    if (figureName === FigureNames.QUEEN){
        return new Queen(figureColor)
    }

    return null
}