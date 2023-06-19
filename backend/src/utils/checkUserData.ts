import {userModel} from '../models/User'
import {errorInEmail} from './data-checkers/user-checkers/errorInEmail'
import {errorInUsername} from './data-checkers/user-checkers/errorInUsername'
import {errorInPassword} from './data-checkers/user-checkers/errorInPassword'
import { ICustomResponse } from '../interfaces'

const checkUserData = async(email : string,username : string,password : string) : Promise<ICustomResponse> => {
    const response : ICustomResponse = {
        message : '',
        status : 200,
    }
    try {
        // check if data is correct
        const passwordErr = errorInPassword(password)
        const usernameErr  = await errorInUsername(username)
        const emailErr  = await errorInEmail(email)

        // any of fields is incorrect
        if (passwordErr || usernameErr || emailErr) {
            response.status = 400
            if (emailErr){
                response.message = emailErr
                return response
            }
            if (passwordErr){
                response.message = passwordErr
                return response
            }
            if (usernameErr){
                response.message = usernameErr
                return response
            }
        }

        return response
    } catch (e) {
        if (e instanceof Error){
            response.message = e.message
        } else {
            response.message = 'Something went wrong...'
        }
        response.status = 500

        return response
    }
}

export default checkUserData