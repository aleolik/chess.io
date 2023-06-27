
import { NextFunction,Request,Response } from 'express'
import jwt from 'jsonwebtoken'
import { IRequestWithUser, IUserFromClient } from '../interfaces'

export default function(req : IRequestWithUser,res : Response,next : NextFunction){

    if (req.method === 'OPTIONS'){
        return next()
    }

    try {
        const token = req.cookies.token
        if (!token){
           return res.status(401).json({"message":"Unathorized"})
        }
        // user data
        const user = jwt.verify(token,process.env.SECRET_KEY) as IUserFromClient

        // wrong data
        if (!user.email || !user.id || !user.username) {
            return res.clearCookie("token").status(401).json({"message":"Unathorized"})
        }

        req.user = user


        return next()
    } catch (e) {
        return res.clearCookie("token").status(401).json({"message":"Unathorized"})
    }

}