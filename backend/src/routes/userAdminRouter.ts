import { Router } from "express"
import userController from "../controllers/userController"
import { AVAILABLE_ROLES } from "../models/User"
import checkRoleMiddleware from "../middleware/checkRoleMiddleware"


const userAdminRouter = Router()


// admin functions
userAdminRouter.use(checkRoleMiddleware(AVAILABLE_ROLES.ADMIN_ROLE))
userAdminRouter.get('/users',userController.getAllUsers)
userAdminRouter.delete('/delete-user/:id',userController.deleteUser)



export default userAdminRouter