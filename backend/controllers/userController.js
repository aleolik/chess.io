const User = require('../models/User.js')
const History = require('../models/History.js')
class userController{
    async register(req,res,next){
        // required fileds
        const {username,password,email} = req.body

        if (!username || !password || !email){
            if (!username){
                return res.json('no username')
            }
            if (!password){
                return res.json('no password')
            }
            if (!email){
                return res.json('no email')
            }
        }
        // not required
        const roles = req.body.roles
        const img = req.body.img || null

        // check if unique
        const ifEmail = User.findOne({where:{email:email}})
        const ifUsername = User.findOne({where:{username:username}})

        if (ifEmail || ifUsername){
            return res.json('not unqie')
        }

        const newUser = await User.create({
            username:username,
            password:password,
            email:email,
            img:img,
            roles:roles
        })

        // create new history for user
        const newHistory = await History.create({id:newUser.id})
        
        return res.json(newUser)
    }
    async getAllUsers(req,res,next){
        const users = await User.findAll()
        return res.json(users)
    }
}


module.exports = new userController()