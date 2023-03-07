const jwt = require('jsonwebtoken')


const generateToken = (id,email,username,roles,img) => {

    const data = {
        id:id,
        email:email,
        roles:roles,
        username:username,
        img : img,
    }

    const settings = {
        expiresIn:'24h'
    }
    
    const token = jwt.sign(
        data,
        process.env.SECRET_KEY,
        settings,
    )
    

    return token
    
}

module.exports = generateToken