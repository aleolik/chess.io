const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')

module.exports = function(role){

    return function(req,res,next){
        if (req.method === 'OPTIONS'){
            return next()
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token){
                return res.status(401).json({"message":"Unathorized"})
            }
            const decoded = jwt.verify(token,process.env.SECRET_KEY)
    
            req.user = decoded

            if (!decoded.roles.includes(role)){
                return res.status(403).json({"message":"Forbbiden"})
            }
    
            next()
        } catch (e) {
            return res.status(403).json({"message":"Forbbiden"})
        }
    }
}