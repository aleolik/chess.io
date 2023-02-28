const sequelize = require('../database/database.js')
const {DataTypes} = require('sequelize')

const User = require('../models/User.js')

const Match = sequelize.define('match',{
    id : {type : DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    winner : {type : DataTypes.INTEGER,allowNull:false} // id of the user,that won
})


module.exports = Match