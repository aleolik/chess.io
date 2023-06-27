import ApiError from "../error/ApiError"
import { Request,Response,NextFunction } from "express"
// last middleware in the chain,provide instance of ApiError to get more info about the problem
const ErrorHandlingMiddleware = (err : ApiError,req : Request,res : Response,next:NextFunction) => {
    if (err instanceof ApiError){
        const message = err.message
        const status = err.status
        return res.status(status).json({"message":message})
    }   
    return res.status(500).json({"message":"Server error!"})
}

export default ErrorHandlingMiddleware