
import { NextFunction,Request,Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUserFromClient } from '../interfaces'

export default function(req : Request,res : Response,next : NextFunction){

    if (req.method === 'OPTIONS'){
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token){
           return res.status(401).json({"message":"Unathorized"})
        }
        // user data
        const user = jwt.verify(token,process.env.SECRET_KEY) as IUserFromClient

        // wrong data
        if (!user.email || !user.id || !user.username) {
            return res.status(401).json({"message":"Unathorized"})
        }

        return next(user)
    } catch (e) {
        return res.status(401).json({"message":"Unathorized"})
    }

}