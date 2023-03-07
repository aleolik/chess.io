
require('dotenv').config()
const sequelize = require('./database/database.js')
const cors = require('cors')
const express = require('express')
const fileUpload = require('express-fileupload')
const startDB = require('./database/startDatabse.js')
const router = require('./routes/index.js')
const path = require('path')
const ErrorHandlingMiddleware = require('./middleware/errorHadnlingMiddleware.js')




const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
// main router,that contains all other routers
app.use('/api',router)
// error handling
app.use(ErrorHandlingMiddleware)

const start = async() => {

    startDB()

    const PORT = process.env.PORT

    app.listen(PORT,(req,res) => {
        console.log(`listening PORT : ${PORT}
        `)
    })
}

start()

