import ApiError from "../error/ApiError"
import { Request,Response,NextFunction } from "express"
// last middleware in the chain,provide instance of ApiError to get more info about the problem
const ErrorHandlingMiddleware = (err : ApiError,req : Request,res : Response,next:NextFunction) => {
    console.log('after middleware',err)
    if (err instanceof ApiError){
        const message = err.message
        const status = err.status
        return res.status(status).json({"message":message})
    }   
    return res.json({"message":"Server error!"}).status(500)
}

export default ErrorHandlingMiddleware