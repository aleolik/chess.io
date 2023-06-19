import { Router } from "express"
import userController from "../controllers/userController"


const userAdminRouter = Router()


// admin functions
userAdminRouter.get('/users',userController.getAllUsers)
userAdminRouter.delete('/delete-user/:id',userController.deleteUser)



export default userAdminRouter