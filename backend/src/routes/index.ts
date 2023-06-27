import {Router} from 'express'
import userRotuer from './userRouter'
import historyRouter from './historyRouter'
import matchRouter from './matchRouter'
import chessRouter from '../chess-logic/chess-routers/chess-router'
import authMiddleware from '../middleware/authMiddleware'
const globalRouter = Router()

globalRouter.use('/history',historyRouter)
globalRouter.use('/match',matchRouter)
globalRouter.use('/user',userRotuer)
globalRouter.use('/chess',authMiddleware,chessRouter)

export default globalRouter