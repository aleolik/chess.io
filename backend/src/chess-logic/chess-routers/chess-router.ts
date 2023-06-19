import {Router} from 'express'
import boardRouter from './board-router'


const chessRouter = Router()

chessRouter.use(boardRouter)

export default chessRouter