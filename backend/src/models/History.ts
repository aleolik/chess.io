import sequelize from '../database/database'
import {DataTypes} from 'sequelize'

const historyModel = sequelize.define('history',{
    id : {type : DataTypes.INTEGER,primaryKey:true,autoIncrement:true}
})


export default historyModel