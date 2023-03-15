const Router = require('express')
const userController = require('../controllers/userController.js')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware.js')
const authMiddleware = require('../middleware/authMiddleware.js')
const userAdminRouter = require('./userAdminRouter.js')
const { ADMIN_ROLE } = require('../models/User.js')


const userRotuer = new Router()

// create new user
userRotuer.post('/register',userController.register)
// login
userRotuer.post('/login',userController.login)
// gets data by token
userRotuer.get('/auth',authMiddleware,userController.check)
// change user data(only yourself)
userRotuer.put('/change-user/:id',authMiddleware,userController.changeUserData)

// admin router
userRotuer.use('/admin',checkRoleMiddleware(ADMIN_ROLE),userAdminRouter)


module.exports = userRotuer