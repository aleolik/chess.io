import { Sequelize } from "sequelize";
export default new Sequelize(
    process.env.POSTGRES_DB, // name of DB
    process.env.POSTGRES_USER, // login for admin
    process.env.POSTGRES_PASSWORD, // password for admin  
    {
        dialect : 'postgres',
        host :  process.env.POSTRESS_HOST,
        port :  parseInt(process.env.POSTGRES_PORT),
    }
)

