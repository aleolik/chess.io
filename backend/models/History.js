const sequelize = require('../database/database.js')
const {DataTypes} = require('sequelize')

const History = sequelize.define('history',{
    id : {type : DataTypes.INTEGER,primaryKey:true,autoIncrement:true}
})


module.exports = History