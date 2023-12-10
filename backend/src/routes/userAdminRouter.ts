import { Router } from "express"
import userController from "../controllers/userController"
import { AVAILABLE_ROLES } from "../models/User"
import checkRoleMiddleware from "../middleware/checkRoleMiddleware"


const userAdminRouter = Router()


// User must have role "ADMIN" to work with endpoints
userAdminRouter.use(checkRoleMiddleware(AVAILABLE_ROLES.ADMIN_ROLE))
userAdminRouter.get('/users',userController.getAllUsers)
userAdminRouter.delete('/delete-user/:id',userController.deleteUser)



export default userAdminRouter