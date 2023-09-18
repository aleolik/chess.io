import { Router } from "express"
import userController from "../controllers/userController"
import authMiddleware from "../middleware/authMiddleware"
import userAdminRouter from "./userAdminRouter"


const userRotuer = Router()

// create new user
userRotuer.post('/register',userController.register)
// login
userRotuer.post('/login',userController.login)
// gets data by token
userRotuer.get('/auth',authMiddleware,userController.check)
// get random password for creating username
userRotuer.get('/random-password',userController.generateRandomPassword)
// logout
userRotuer.post('/logout',authMiddleware,userController.logout)

// admin router
userRotuer.use('/admin',userAdminRouter)


export default userRotuer