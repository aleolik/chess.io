const sequelize = require('../database/database.js')
const {DataTypes} = require('sequelize')

const User = require('../models/User.js')

const History = sequelize.define('history',{
    id : {type : DataTypes.INTEGER,primaryKey:true,autoIncrement:true}
})


module.exports = History