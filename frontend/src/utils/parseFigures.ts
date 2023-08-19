

import { Figure } from "../chess-logic/models/Figure"
import { createFigureByProperties } from "./createFigureByProperties"

export const parseFigures = (figures : Array<Figure>) : Array<Figure> => {
    for (let i = 0;i<figures.length;i++){
      const figure = createFigureByProperties(figures[i])
      if (figure) {
        figures[i] = figure
      }
    }

    return figures
}

