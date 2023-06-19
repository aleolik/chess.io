import { Router } from "express"
import userController from "../controllers/userController"
import checkRoleMiddleware from "../middleware/checkRoleMiddleware"
import authMiddleware from "../middleware/authMiddleware"
import userAdminRouter from "./userAdminRouter"
import { AVAILABLE_ROLES } from "../models/User"


const userRotuer = Router()

// create new user
userRotuer.post('/register',userController.register)
// login
userRotuer.post('/login',userController.login)
// gets data by token
userRotuer.get('/auth',authMiddleware,userController.check)
// change user data(only yourself)
userRotuer.put('/change-user/:id',authMiddleware,userController.changeUserData)
// get random password for creating username
userRotuer.get('/random-password',userController.generateRandomPassword)

// admin router
userRotuer.use('/admin',checkRoleMiddleware(AVAILABLE_ROLES.ADMIN_ROLE),userAdminRouter)


export default userRotuer