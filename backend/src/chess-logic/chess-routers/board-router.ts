import {Router} from 'express'
import BoardController from '../chess-controllers/BoardController'
import authMiddleware from '../../middleware/authMiddleware'

const boardRouter = Router()

boardRouter.get('/get-new-board',authMiddleware,BoardController.getNewBoard)

export default boardRouter