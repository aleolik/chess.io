import { Bishop } from "../chess-logic/figures/Bishop";
import { Horse } from "../chess-logic/figures/Horse";
import { King } from "../chess-logic/figures/King";
import { Pawn } from "../chess-logic/figures/Pawn";
import { Queen } from "../chess-logic/figures/Queen";
import { Rook } from "../chess-logic/figures/Rook";
import { Figure, FigureNames } from "../chess-logic/models/Figure";

export const createFigureByProperties = (figure : Figure) : Figure | null => {
    if (figure.name === FigureNames.ROOK){
        return new Rook(figure.color,figure.id)
    }
    if (figure.name === FigureNames.PAWN){
        const pawn = figure as Pawn
        return new Pawn(figure.color,pawn.isFirstTurn,figure.id)
    }
    if (figure.name === FigureNames.HORSE){
        return new Horse(figure.color,figure.id)
    }
    if (figure.name === FigureNames.BISHOP){
        return new Bishop(figure.color,figure.id)
    }
    if (figure.name === FigureNames.KING){
        const king = figure as King
        return new King(figure.color,king.canSwap,figure.id)
    }
    if (figure.name === FigureNames.QUEEN){
        return new Queen(figure.color,figure.id)
    }

    return null
}