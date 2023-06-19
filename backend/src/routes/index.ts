import {Router} from 'express'
import userRotuer from './userRouter'
import historyRouter from './historyRouter'
import matchRouter from './matchRouter'
import chessRouter from '../chess-logic/chess-routers/chess-router'
const globalRouter = Router()

globalRouter.use('/history',historyRouter)
globalRouter.use('/match',matchRouter)
globalRouter.use('/user',userRotuer)
globalRouter.use('/chess',chessRouter)

export default globalRouter