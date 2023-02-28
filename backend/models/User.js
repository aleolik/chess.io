const sequelize = require('../database/database.js')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id : {type : DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    username : {type : DataTypes.STRING(35),unique:true,allowNull:false}, // max symbols - 35
    password : {type : DataTypes.STRING(40),allowNull:false}, // max - symbols - 40
    email : {type : DataTypes.STRING,allowNull:false,unique:true},
    roles : {type : DataTypes.ARRAY(DataTypes.STRING),defaultValue:['user']},
    img : {type : DataTypes.STRING,defaultValue:null,unique:true}
})

module.exports = User