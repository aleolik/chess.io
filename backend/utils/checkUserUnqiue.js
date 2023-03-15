const ApiError = require('../error/ApiError')
const {User} = require('../models/User')

// returns message (error) or true
const checkUserUnqiue = async(email=null,username=null) => {
    const obj = {
        message : '',
        isUnique : false,
    }

    if (!email || !username){
        obj.message = 'username or email were not provided'
        return obj
    }
    const ifEmailExists = await User.findOne({where:{email:email}})
    const ifUsernameExists = await User.findOne({where:{username:username}})

    if (ifEmailExists) {
        obj.message = 'Account with provided email already exists'
        return obj
    }
    if (ifUsernameExists) {
        obj.message = 'Account with provided username already exists'
        return obj
    }
    obj.isUnique = true
    return obj
}

module.exports = checkUserUnqiue