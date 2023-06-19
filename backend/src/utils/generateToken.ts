import jwt from 'jsonwebtoken'
import {AVAILABLE_ROLES} from '../models/User'

const generateToken = (id : number,email : string,username : string) => {


    const data = {
        id:id,
        email:email,
        username:username
    }

    const settings = {
        expiresIn:'1h'
    }
    
    const token = jwt.sign(
        data,
        process.env.SECRET_KEY,
        settings,
    )
    

    return token
    
}

export default generateToken