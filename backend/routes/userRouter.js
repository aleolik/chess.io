const Router = require('express')
const userController = require('../controllers/userController.js')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware.js')
const authMiddleware = require('../middleware/authMiddleware.js')


const userRotuer = new Router()

// create new user
userRotuer.post('/register',userController.register)
// login
userRotuer.post('/login',userController.login)
// gets data by token
userRotuer.get('/auth',authMiddleware,userController.check)
// admin functions
userRotuer.get('/users',userController.getAllUsers)
// userRotuer.delete('/:id',userController.deleteUser)


module.exports = userRotuer