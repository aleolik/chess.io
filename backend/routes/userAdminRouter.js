const Router = require('express')
const userController = require('../controllers/userController.js')


const userAdminRouter = new Router()


// admin functions
userAdminRouter.get('/users',userController.getAllUsers)
userAdminRouter.post('/register',userController.registerUserWithPrivileges)
userAdminRouter.delete('/delete-user/:id',userController.deleteUser)



module.exports = userAdminRouter