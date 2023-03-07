const sequelize = require('../database/database.js')
const {DataTypes} = require('sequelize')

const Match = sequelize.define('match',{
    id : {type : DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    winner : {type : DataTypes.INTEGER,allowNull:false} // id of the user,that won
})


module.exports = Match