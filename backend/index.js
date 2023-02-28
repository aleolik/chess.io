
require('dotenv').config()
const sequelize = require('./database/database.js')
const cors = require('cors')
const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
const startDB = require('./database/startDatabse.js')
const router = require('./routes/index.js')



const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use('/api',router)

const start = async() => {

    startDB()

    const PORT = process.env.PORT

    app.listen(PORT,(req,res) => {
        console.log(`listening PORT : ${PORT}
        `)
    })
}

start()

