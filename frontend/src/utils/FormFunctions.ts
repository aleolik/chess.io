// INPUT CONTROLLERS for login and register forms

import axiosPublic from '../axios/publicInstance'

/* ------------------- USERNAME : -------------------------- */

const minUsernameLength  : number = 2
const maxUsernameLength : number = 45


const checkUsernameLength = (username : string) : boolean => {
    // check if username's length is acceptable
    return username.length >= minUsernameLength && username.length <= maxUsernameLength
}




export const checkUsername = (username : string) : string => {

    let err : string = ''

    
    if (!username){
        err = 'Username was not provided!'
        return err
    }
        
    if (!checkUsernameLength(username)){
        err = `Username must be from ${minUsernameLength} to ${maxUsernameLength} symbols`
        return err;
    }

    return err

}


/* ------------------- PASSWORD : -------------------------- */

const minPasswordLength : number = 8
const maxPasswordLength : number = 50

const checkPasswordLength = (password : string) : boolean => {
    return password.length >= minPasswordLength && password.length <= maxPasswordLength
}

interface IPasswordChecker{
    hasSpecialSymbol : boolean
    hasBigLetter : boolean
    hasNumber : boolean
}

const specialSymbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~' // symbols from generate-random passwrd lib(only this symbols can be generated)


const checkPasswordSymbols = (password : string) : boolean => {
    const checker : IPasswordChecker = {
        hasSpecialSymbol : false,
        hasBigLetter : false,
        hasNumber : false,
    }
    const bigLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM'
    const numbers = [0,1,2,3,4,5,6,7,8,9]

    for (let i = 0;i<password.length;i++){
        if (specialSymbols.includes(password[i])){
            checker.hasSpecialSymbol = true
        }
        if (bigLetters.includes(password[i])){
            checker.hasBigLetter = true
        }
        if (numbers.includes(parseInt(password[i]))){
            checker.hasNumber = true
        }
    }

    return checker.hasBigLetter && checker.hasSpecialSymbol && checker.hasNumber
}

export const checkPassword = (password : string) : string => {

    let err : string = ''

    if (!password){
        err = 'Password was not provided!'
        return err
    }

    if (!checkPasswordLength(password)){
        err = `Password must be from ${minPasswordLength} to ${maxPasswordLength} symbols`
        return err;
    }
    
    if (!checkPasswordSymbols(password)){
        let err = 'Password must include at least 1 number,1 special symbol and 1 uppercase letter.'
        return err;
    }

    return err

}

/* ------------------- EMAIL : -------------------------- */

const checkEmailFormat = (email : string) : boolean => {

    const editedEmail = email.toLowerCase()

    if (!editedEmail.includes('@gmail.com')){
        return false
    }


    return true
}

export const checkEmail = (email : string) : string => {

    let err = ''

    if (!email){
        err = 'Email was not provided!'
        return err
    }

    if(!checkEmailFormat(email)){
        err = 'You need to add @gmail.com to your email adress'
        return err;
    }


    return err

}


export const getRandomCorrectPassword = async() : Promise<string> => {
    // can not be used with axios userInstance because client is not signed in
    const url = '/user/random-password'
    try {
        const response = await axiosPublic.get(url)

        if (response.status === 200){
            const data = response.data

            return data?.password
        }

        return ''
    } catch (error) {
        return ''
    }
} 