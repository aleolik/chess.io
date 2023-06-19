
import sequelize from '../database/database'
import {DataTypes, Model} from 'sequelize'

export enum AVAILABLE_ROLES{
    USER_ROLE="USER_ROLE",
    ADMIN_ROLE="ADMIN_ROLE"
}

export const userModel = sequelize.define('user',{
    id : {type : DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
    username : {type : DataTypes.STRING(50),unique:true,allowNull:false}, // max symbols - 50
    password : {type : DataTypes.STRING(400),allowNull:false}, // max - symbols - 400
    email : {type : DataTypes.STRING,allowNull:false,unique:true},
    roles : {type : DataTypes.ARRAY(DataTypes.STRING),defaultValue:[AVAILABLE_ROLES.USER_ROLE]},
})

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password : string;
    roles : Array<AVAILABLE_ROLES>;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
export class userClass extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password! : string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public roles: Array<AVAILABLE_ROLES>
  }
  
  userClass.init(
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
      modelName: 'user', // name of the model
    }
  );

