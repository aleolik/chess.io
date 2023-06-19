import ApiError from "../error/ApiError"
import {userModel, userClass, AVAILABLE_ROLES} from "../models/User"
import generateToken from "../utils/generateToken"
import History from "../models/History"
import bcrypt from 'bcrypt'
import checkUserData from "../utils/checkUserData"
import generatePassword from 'generate-password'
import getRandomInt from "../utils/getRandomInt"
import { Request,Response,NextFunction  } from "express"
import { IRequestWithUser, IUserFromClient } from "../interfaces"

class userController{
    async register(req : Request,res : Response,next : NextFunction){
        try {
            // required fileds
            const {username,password,email} = req.body
            if (!username || !password || !email){
                if (!username){
                    return next(ApiError.badRequest("username was not provided"))
                }
                if (!password){
                    return next(ApiError.badRequest('password was not provided'))
                }
                if (!email){
                    return next(ApiError.badRequest('email was not provided'))
                }
            } 

            // check if given data is correct
            const response = await checkUserData(email,username,password)
            if (response.status !== 200){
                if (response.status === 500){
                    return next(ApiError.internal(response.message))
                }
                if (response.status === 400){
                    return next(ApiError.badRequest(response.message))
                }
            }
            

            // hash password
            const hashedPassword = await bcrypt.hash(password,7)

            const newUser = await userModel.create({
                username:username,
                password:hashedPassword,
                email:email,
            }) as userClass

            // create new history for user
            // const newHistory = await History.create({id:newUser.id})

            const token = generateToken(
                newUser.id,
                newUser.email,
                newUser.username
            )
            
            return res.json({"token":token})
        } catch(error){
            console.log(" catch register is being called")
            return next(ApiError.badRequest(error))
        }
        
    }
    async login(req : Request,res : Response,next : NextFunction){
        try {
            const {email,password} = req.body
        
            if (!email){
                return next(ApiError.badRequest('email was not provided'))
            }
            if (!password){
                return next(ApiError.badRequest('password was not provided'))
            }
    
            const user = await userModel.findOne({where:{email:email}}) as userClass
    
            if (!user){
                return next(ApiError.badRequest('email or password are wrong!'))
            }
    
            const comparePassword = bcrypt.compareSync(password,user.password)
    
            if (!comparePassword){
                return next(ApiError.badRequest('email or password are wrong!'))
            }
    
            const token = generateToken(
                user.id,
                user.email,
                user.username
            )
            
            return  res.json({"token":token})
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async changeUserData(req : IRequestWithUser,res : Response,next : NextFunction){
        try {
            const id = req.params?.id
            // TODO : ability to change email and password also
            const {
                username,
                email,
            } = req.body
            
            const userByToken = req.user
                
            if (!id){
                return next(ApiError.badRequest('id was not provided'))
            }

            if (userByToken.id !== parseInt(id)){
                return next(ApiError.badRequest('You can only change personal info!'))
            }
    
            const user = await userModel.findOne({where:{id:id}})
    
            if (!user){
                return next(ApiError.badRequest(`user with id : ${id} does not exist!`))
            }
            
            // check if username is free
            if (req.user.username !== username){
                const ifUsernameExists = await userModel.findOne({where:{username:username}})
                if (ifUsernameExists) {
                    return next(ApiError.badRequest(`account with username : '${username}' already exists!`))
                }
            }
            // check if email is free
            if (req.user.email !== email){
                const ifEmailExists = await userModel.findOne({where:{email:email}})
                if (ifEmailExists) {
                    return next(ApiError.badRequest(`account with email : '${email}' already exists!`))
                }
            }

            // TODO : check user data

            
            // everything is correct,update user data
            await user.update({
                username : username,
                email : email,
            })
    
            return res.json({"user":user})
        } catch (e) { 
            next(ApiError.badRequest(e))
        }
    }

    async check(user : IUserFromClient,req : Request,res : Response,next : NextFunction){
        try {
            const token = generateToken(
                user.id,
                user.email,
                user.username,
            )
            return res.json({"token":token})
        } catch (e) {
           next(ApiError.badRequest(e?.message))
        }
    }

    async generateRandomPassword(req : Request,res : Response,next : NextFunction){
        const usernameLengthMin = 20
        const usernameLengthMax = 35
        try {
            const randomLength = getRandomInt(usernameLengthMin,usernameLengthMax)
            // TODO : diff special symbols
            const password = generatePassword.generate({
                length:randomLength,
                numbers:true,
                symbols:true,
                uppercase:true,
                lowercase:true,
                strict:true  
            })

            return res.json({"password":password})
        } catch (error) {
            next(ApiError.internal(error?.message))
        }
    }
    // admin function
    async getAllUsers(req : Request,res : Response,next : NextFunction){
        try {
            const users = await userModel.findAll()
            console.log(users)
            return res.json(users)
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }
    async deleteUser(req : Request,res : Response,next : NextFunction){
        try {
            const id = req.params?.id

            // check id type
            const isNum = parseInt(id).toString() === id

            if (!isNum){
                return next(ApiError.badRequest('id can only be number type'))
            }

            const user = await userModel.findOne({where:{id:id}})

            if (!user){
                return next(ApiError.badRequest(`user with id :${id},does not exist`))
            }

            await user.destroy()
            
            return res.json({"user":user,"message":"user was deleted"})
        } catch (e) {
            next(ApiError.badRequest(e))
        }
    }
}


export default new userController()