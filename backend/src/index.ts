import dotenv from 'dotenv'
import ErrorHandlingMiddleware from "../src/middleware/errorHandlingMiddleware"
import path from 'path'
// or your path to dev.env file
dotenv.config({path:path.resolve(__dirname,"./dev.env")})
import cors from 'cors'
import express from 'express'
import startDB from '../src/database/startDatabse'
import globalRouter from '../src/routes/index'
import initalizeWebSocketServer from '../src/WSS/wss_init'
import cookieParser from 'cookie-parser'

const app = express()
// use cors
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Allow sending cookies with the request
}
app.use(cors(corsOptions))
// cookie-parser
app.use(cookieParser())
// use json
app.use(express.json())
// use global router
//
app.use('/api',globalRouter)
// use error handling
app.use(ErrorHandlingMiddleware)
initalizeWebSocketServer(app)

const start = async() => {

    startDB()

    const PORT = parseInt(process.env.PORT)

    const HOST = process.env.HOST // listen all interfaces or not (all by default)

    app.listen(PORT,HOST,() => {
        console.log(`listening PORT : ${PORT}
        `)
    })
}

start()

