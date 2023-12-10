import dotenv from 'dotenv'
import path from 'path'
// or your path to dev.env file
dotenv.config({path:path.resolve(__dirname,"./dev.env")})
import ErrorHandlingMiddleware from "../src/middleware/errorHandlingMiddleware"
import cors from 'cors'
import express from 'express'
import startDatabase from '../src/database/startDatabse'
import globalRouter from '../src/routes/index'
import initalizeWebSocketServer from '../src/WSS/wss_init'
import cookieParser from 'cookie-parser'

const app = express()
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, // Allow sending cookies with the request
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use('/api',globalRouter)
// error handling middleware must be the last included middleware in middlewares
app.use(ErrorHandlingMiddleware)
const start = async() => {

    await startDatabase()

    initalizeWebSocketServer(app)


    const PORT = parseInt(process.env.PORT)

    const HOST = process.env.HOST // listen all interfaces or not (all by default)

    app.listen(PORT,HOST,() => {
        console.log(`listening PORT : ${PORT}
        `)
    })
}

start()

