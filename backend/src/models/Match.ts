import sequelize from '../database/database'
import {DataTypes} from 'sequelize'

const matchModel = sequelize.define('match',{
    id : {type : DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    winner : {type : DataTypes.INTEGER,allowNull:false} // id of the user,that won
})


export default matchModel