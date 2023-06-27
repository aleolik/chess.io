import ApiError from '../error/ApiError'
import jwt from 'jsonwebtoken'
import { AVAILABLE_ROLES, userClass } from '../models/User'
import { IUser, IUserFromClient } from '../interfaces'
import { NextFunction,Request,Response } from 'express'


const checkRoleMiddleware = (RoleUserNeedToHave : AVAILABLE_ROLES) => {
    return async function(req : Request,res : Response,next : NextFunction){
        if (req.method === 'OPTIONS'){
            return next()
        }
    
        try {
            const token = req.cookies.token
            if (!token){
                return res.status(401).json({"message":"Unathorized"})
            }

            // decoded value is an user object
            const user = jwt.verify(token,process.env.SECRET_KEY) as IUserFromClient
            
            if (!user.email || !user.id || !user.username) {
                return res.status(403).json({"message":"Unathorized"})
            }

            const userFromDB = await userClass.findOne({where:{email:user.email}})

            if (userFromDB.roles.includes(RoleUserNeedToHave)){
                return next()
            }
    
            return res.status(403).json({"message":"Forbbiden"})
        } catch (e) {
            return res.status(403).json({"message":e.message})
        }
    }
}


export default checkRoleMiddleware