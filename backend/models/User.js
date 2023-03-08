const sequelize = require('../database/database.js')
const {DataTypes} = require('sequelize')

const USER_ROLE = process.env.USER_ROLE // string
const ADMIN_ROLE = process.env.ADMIN_ROLE // string

const AVAILABLE_ROLES = [
    USER_ROLE,
    ADMIN_ROLE,
]

const User = sequelize.define('user',{
    id : {type : DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    username : {type : DataTypes.STRING(50),unique:true,allowNull:false}, // max symbols - 50
    password : {type : DataTypes.STRING(400),allowNull:false}, // max - symbols - 400
    email : {type : DataTypes.STRING,allowNull:false,unique:true},
    roles : {type : DataTypes.ARRAY(DataTypes.STRING),defaultValue:['user']},
    img : {type : DataTypes.STRING,defaultValue:null,unique:true}
})

module.exports = {
    User,
    USER_ROLE,
    ADMIN_ROLE,
    AVAILABLE_ROLES
}