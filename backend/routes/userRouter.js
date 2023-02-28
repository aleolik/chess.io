const Router = require('express')
const userController = require('../controllers/userController')
const userRotuer = new Router()

// create new user
userRotuer.post('',userController.register)
// get all users
userRotuer.get('',userController.getAllUsers)


module.exports = userRotuer