import {Router} from 'express'
import userRotuer from './userRouter'
const globalRouter = Router()


globalRouter.use('/user',userRotuer)

export default globalRouter