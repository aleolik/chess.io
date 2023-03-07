const ApiError = require("../error/ApiError")
const User = require("../models/User")
const generateToken = require("../utils/generateToken")
const ImgHandler = require("../utils/imgHandler")
const History = require('../models/History')
const bcrypt = require('bcrypt')



class userController{
    async register(req,res,next){
        try {
            // required fileds
            const {username,password,email} = req.body

            if (!username || !password || !email){
                if (!username){
                    return next(ApiError.badRequest('username was not provided'))
                }
                if (!password){
                    return next(ApiError.badRequest('password was not provided'))
                }
                if (!email){
                    return next(ApiError.badRequest('email was not provided'))
                }
            }
            // not required
            const img = req.files.img || null

            // check if unique
            const emailExists = await User.findOne({where:{email:email}})
            const usernameExists = await User.findOne({where:{username:username}})

            if (usernameExists || emailExists){
                if (emailExists){
                    return next(ApiError.badRequest('user with this email already exists!'))
                }
                if (usernameExists){
                    return next(ApiError.badRequest('user with this username already exists!'))
                }
            }
            
            // imgHandler

            let imgPath = null

            if (img){
                imgPath = ImgHandler(img,username)
                if (!imgPath){
                    return next(ApiError.badRequest('user avatar can only be .jpeg,.png,.jpg types'))
                }
                img.mv(imgPath)
            }

            const newUser = await User.create({
                username:username,
                password:password,
                email:email,
                img:imgPath,
            })

            // create new history for user
            const newHistory = await History.create({id:newUser.id})

            const token = generateToken(
                newUser.id,
                newUser.email,
                newUser.roles,
                newUser.username,
                newUser.img
            )
            
            
            return res.json({"token":token})
        } catch(e){
            next(new ApiError(e.status,e.message))
        }
        
    }
    async registerUserWithPrivileges(req,res,next){

    }
    async login(req,res,next){
        const {email,password} = req.body
        
        if (!email){
            return next(ApiError.badRequest('email was not provided'))
        }
        if (!password){
            return next(ApiError.badRequest('password was not provided'))
        }

        const user = await User.findOne({where:{email:email}})

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
            user.roles,
            user.username,
            user.img
        )
        
        return res.json({"token":token})
        

    }
    async check(req,res,next){
        try {
            const token = generateToken(
                req.user.id,
                req.user.email,
                req.user.roles,
                req.user.username,
                req.user.img,
            )

            return res.json({"token":token})
        } catch (e) {
            next(new ApiError(e.status,e.message))
        }
    }
    // admin function
    async getAllUsers(req,res,next){
        try {
            const users = await User.findAll()
            return res.json(users)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}


module.exports = new userController()