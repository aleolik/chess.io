import { userModel } from "../../../models/User"

const errorInEmailFormat = (email : string) => {

    const editedEmail = email.toLowerCase()

    if (editedEmail.includes('@gmail.com')){
        return false
    }


    return true
}

export const errorInEmail = async(email : string) : Promise<string> => {

    if (typeof email !== 'string'){
        return 'Email must be string'
    }

    if(errorInEmailFormat(email)){
        return 'You need to add @gmail.com to your email adress'
    }

    const emailExists = await userModel.findOne({where:{email:email}})

    if (emailExists) {
        return 'This email was already used for another user'
    }


    return ''

}

