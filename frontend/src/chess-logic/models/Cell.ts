    import { Board } from "./Board";
    import { Colors } from "./Colors";
    import { Figure, FigureNames } from "./Figure";
    import {v4} from 'uuid'
    import { King } from "../figures/King";



    export type availableCoordinates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
    export class Cell{
        readonly i : availableCoordinates;
        readonly j : availableCoordinates;
        readonly color : Colors;
        figure : Figure | null = null;
        available : boolean;
        id : string;
        constructor(i:availableCoordinates,j:availableCoordinates,color:Colors,figure:Figure | null){
            this.i = i; // row
            this.j = j; // column
            this.color = color;
            this.available = false
            this.id = v4()
            this.figure = figure
        }


        public isEnemy(targetCell:Cell) : boolean{
            if (targetCell.figure && this.figure){
                return this.figure.color !== targetCell.figure.color
            }
            return false
        }

        public isEmpty = () : boolean => {
            return this.figure === null
        }

    }