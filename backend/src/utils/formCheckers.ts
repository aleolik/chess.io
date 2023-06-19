// INPUT CONTROLLERS for login and register forms


/* ------------------- USERNAME : -------------------------- */

const minUsernameLength = 2
const maxUsernameLength = 45


const checkUsernameLength = (username) => {
    // check if username's length is acceptable
    return username.length >= minUsernameLength && username.length <= maxUsernameLength
}




export const checkUsername = (username : string) => {

    let err = ''

    if (typeof username !== 'string'){
        err = 'Username must be string'
        return err
    }
        
    if (!checkUsernameLength(username)){
        err = `Username must be from ${minUsernameLength} to ${maxUsernameLength} symbols`
        return err;
    }

    return err

}


/* ------------------- PASSWORD : -------------------------- */

const minPasswordLength = 8
const maxPasswordLength = 50

const checkPasswordLength = (password) => {
    return password.length >= minPasswordLength && password.length <= maxPasswordLength
}

const specialSymbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~' // symbols from generate-random passwrd lib(only this symbols can be generated)


const checkPasswordSymbols = (password) => {
    const checker = {
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

export const checkPassword = (password) => {

    let err = ''

    if (typeof password !== 'string'){
        err = 'Password must be string'
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

const checkEmailFormat = (email) => {

    const editedEmail = email.toLowerCase()

    if (!editedEmail.includes('@gmail.com')){
        return false
    }


    return true
}

export const checkEmail = (email) => {

    let err = ''

    if (typeof email !== 'string'){
        err = 'Email must be string'
        return err
    }

    if(!checkEmailFormat(email)){
        err = 'You need to add @gmail.com to your email adress'
        return err;
    }


    return err

}

