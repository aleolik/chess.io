const ApiError = require("../error/ApiError")
const {User,ADMIN_ROLE,USER_ROLE,AVAILABLE_ROLES} = require("../models/User")
const generateToken = require("../utils/generateToken")
const ImgHandler = require("../utils/imgHandler")
const History = require('../models/History')
const bcrypt = require('bcrypt')
const checkUserUnqiue = require("../utils/checkUserUnqiue")
const checkAvailableRoles = require("../utils/checkAvailableRoles")
const checkIdType = require('../utils/checkIdType.js')
const fs = require('fs')
const {getDirByUsername} = require('../utils/fileOperations.js')
const path = require('path')

class userController{
    async register(req,res,next){
        try {
            // required fileds
            const {username,password,email} = req.body
            // not required
            const img = req?.files?.img || null


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
            // check if unique
            const userObj = await checkUserUnqiue(email,username)
            if (!userObj.isUnique){
                return next(ApiError.badRequest(userObj.message))
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

            // hash password
            const hashedPassword = await bcrypt.hash(password,7)

            const newUser = await User.create({
                username:username,
                password:hashedPassword,
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
            next(ApiError.badRequest(e.message))
        }
        
    }
    async registerUserWithPrivileges(req,res,next){
        try {
            // required fileds
            const {username,password,email,roles} = req.body
            // not required
            const img = req?.files?.img || null

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
        
            // check if unique
            const userObj = await checkUserUnqiue(email,username)
            if (!userObj.isUnique){
                return next(ApiError.badRequest(userObj.message))
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
        
            // hash password
            const hashedPassword = await bcrypt.hash(password,7)

            // handle roles
            const rolesObj = checkAvailableRoles(roles)
            if (rolesObj.error){
                return next(ApiError.badRequest(rolesObj.error))
            }
        
            const newUser = await User.create({
                username:username,
                password:hashedPassword,
                email:email,
                img:imgPath,
                roles:roles
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
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async login(req,res,next){
        try {
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
                user.username,
                user.roles,
                user.img
            )
            
            return res.json({"token":token})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async changeUserData(req,res,next){
        try {
            const id = req.params?.id
            // TODO : ability to change email and password also
            const {
                username,
                email,
            } = req.body

            const img = req.files?.img || null

            const userByToken = req.user

            if (userByToken.id !== parseInt(id)){
                return next(ApiError.badRequest('You can only change personal info!'))
            }
    
            if (!id){
                return next(ApiError.badRequest('id was not provided'))
            }
    
            const user = await User.findOne({where:{id:id}})
    
            if (!user){
                return next(ApiError.badRequest(`user with id : ${id} does not exist!`))
            }
            
            // check if username is free
            if (req.user.username !== username){
                const ifUsernameExists = await User.findOne({where:{username:username}})
                if (ifUsernameExists) {
                    return next(ApiError.badRequest(`account with username : '${username}' already exists!`))
                }
            }
            // check if email is free
            if (req.user.email !== email){
                const ifEmailExists = await User.findOne({where:{email:email}})
                if (ifEmailExists) {
                    return next(ApiError.badRequest(`account with email : '${email}' already exists!`))
                }
            }

            let newFilePath = null 
            if (req.user.img !== img){
                newFilePath = ImgHandler(img)
                if (newFilePath && user.img){
                    // delete old img in folder
                    try {
                        const dir = getDirByUsername(user.username)
                        const pathToFile = path.resolve(dir,user.img)
                        fs.unlinkSync(pathToFile)
                    } catch (e) {
                        console.error('img in folder was not deleted')
                    }
                }
            }

            await user.update({
                username : username ? username : user.username,
                img : newFilePath ? newFilePath : user.img,
                email : email ? email : user.email
            })
    
            return res.json({"user":user})
        } catch (e) { 
            next(ApiError.badRequest(e.message))
        }
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
           next(ApiError.badRequest(e.message))
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
    async deleteUser(req,res,next){
        try {
            const id = req.params?.id

            // check id type
            const isNum = checkIdType(id)

            if (!isNum){
                return next(ApiError.badRequest('id can only be number type'))
            }

            const user = await User.findOne({where:{id:id}})

            if (!user){
                return next(ApiError.badRequest(`user with id :${id},does not exist`))
            }

            await user.destroy()

            // TODO : remove static file
            if (user.img){
                try {
                    const dir = getDirByUsername(user.username)
                    if (fs.existsSync(dir)){
                        fs.rmdirSync(dir,{ recursive: true, force: true })
                    }
                } catch (e) {
                    
                }
            }
            
            return res.json({"user":user,"message":"user was deleted"})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}


module.exports = new userController()