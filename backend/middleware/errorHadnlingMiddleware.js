const ApiError = require('../error/ApiError')

// last middleware in the chain,provide instance of ApiError to get more info about the problem
const ErrorHandlingMiddleware = (err,req,res,next) => {
    if (err instanceof ApiError){
        return res.status(err.status).json(err.message)
    }   
    return res.status(500).json('Server error!')
}

module.exports = ErrorHandlingMiddleware    