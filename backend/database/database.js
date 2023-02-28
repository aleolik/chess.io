const {Sequelize} = require('sequelize')
module.exports = new Sequelize(
    process.env.DB_NAME, // name of DB
    process.env.DB_USER, // login for admin
    process.env.DB_PASSWORD, // password for admin  
    {
        dialect : 'postgres',
        host :  process.env.DB_HOST,
        port :  process.env.DB_PORT,
    }
)

