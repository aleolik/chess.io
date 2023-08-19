/*
    All methods are being erased while sending class instances in json format
    so this function re-creates new objects with given cells
*/

import { Cell } from "../chess-logic/models/Cell"
import { Figure } from "../chess-logic/models/Figure"
import { createFigureByProperties } from "./createFigureByProperties"

export const parseCells = (cells : Cell[][]) : Cell[][] => {
    for (let i = 0;i<cells.length;i++){
        for (let j = 0;j<cells.length;j++){
            let figure : Figure | null = null
            const currentCell = cells[i][j]
            if (currentCell.figure){
                figure = createFigureByProperties(currentCell.figure)
            }
            cells[i][j] = new Cell(currentCell.i,currentCell.j,currentCell.color,figure)

        }
    }

    return cells
}