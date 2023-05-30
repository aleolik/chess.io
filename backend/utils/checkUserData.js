
const {User} = require('../models/User')
const {checkEmail,checkPassword,checkUsername} = require('./formCheckers')



const response = {
    message : '',
    status : 200,
}

const checkUserData = async(email,username,password) => {
    try {
        if (!email || !username || !password){
            response.status = 404
            response.message = 'data in checkUserData() was not provided'
            return response
        }

        // check if data is correct
        const errorInPassword = checkPassword(password)
        const errorInUsername  = checkUsername(username)
        const errorInEmail  = checkEmail(email)

        // ERROR : data is not correct
        if (errorInUsername || errorInEmail || errorInPassword) {
            response.status = 404
            if (errorInEmail){
                response.message = errorInEmail
                return response
            }
            if (errorInUsername){
                response.message = errorInUsername
                return response
            }
            if (errorInPassword){
                response.message = errorInPassword
                return response
            }
        }

        const emailExists = await User.findOne({where:{email:email}})
        const usernameExists = await User.findOne({where:{username:username}})

        if (emailExists || usernameExists) {
            response.status = 404
            if (emailExists){
                response.message = 'Account with provided email already exists'
                return response
            }
            if (usernameExists){
                response.message = 'Account with provided username already exists'
                return response
            }

        }

        return response
    } catch (e) {
        if (e instanceof Error){
            response.message = e.message
        } else {
            response.message = 'Something went wrong...'
        }
        response.status = 500

        return response
    }
}

module.exports = checkUserData