import jwt from 'jsonwebtoken'

const generateToken = (id : number,email : string,username : string) => {


    const data = {
        id:id,
        email:email,
        username:username
    }

    const settings = {
        expiresIn:'24h'
    }
    
    const token = jwt.sign(
        data,
        process.env.SECRET_KEY,
        settings,
    )
    

    return token
    
}

export default generateToken