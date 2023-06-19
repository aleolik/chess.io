import {Router} from 'express'
import BoardController from '../chess-controllers/BoardController'

const boardRouter = Router()

boardRouter.get('/get-new-board',BoardController.getNewBoard)

export default boardRouter