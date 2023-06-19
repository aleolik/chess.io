
import dotenv from 'dotenv'
dotenv.config()
import ErrorHandlingMiddleware from "./src/middleware/errorHandlingMiddleware"
import cors from 'cors'
import express from 'express'
import startDB from './src/database/startDatabse'
import globalRouter from './src/routes/index'
import initalizeWebSocketServer from './src/WSS/wss_init'


const app = express()
// use cors
app.use(cors())
// use json
app.use(express.json())
// use global router
app.use('/api',globalRouter)
// use error handling
app.use(ErrorHandlingMiddleware)
initalizeWebSocketServer(app)

const start = async() => {

    startDB()

    const PORT = process.env.PORT

    app.listen(PORT,() => {
        console.log(`listening PORT : ${PORT}
        `)
    })
}

start()
