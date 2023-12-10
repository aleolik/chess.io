import sequelize from '../database/database'
import {ArrayDataType, DataTypes, Model} from 'sequelize'

export enum AVAILABLE_ROLES{
    USER_ROLE="USER_ROLE",
    ADMIN_ROLE="ADMIN_ROLE"
}
interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password : string;
    roles : Array<AVAILABLE_ROLES>;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Model<UserAttributes> implements UserAttributes{
    public id: number;
    public username: string;
    public email: string;
    public password: string;
    public readonly createdAt : Date;
    public updatedAt : Date;
    public roles: Array<AVAILABLE_ROLES>

    log() {
      
    }
}
  
// create table in database
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    roles : {
      type : DataTypes.ARRAY(DataTypes.STRING),
      defaultValue:[AVAILABLE_ROLES.USER_ROLE]
    },
    password : {
      type : DataTypes.STRING,
      allowNull : false,
    }
  },
  {
    sequelize, // your Sequelize instance
    modelName: 'User', // name of the model
  }
);

