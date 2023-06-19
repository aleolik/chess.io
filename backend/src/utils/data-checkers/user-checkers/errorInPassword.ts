// password can be from minPasswordLength to maxPasswordLength symbols length
const minPasswordLength = 8
const maxPasswordLength = 50

const checkPasswordLength = (password : string) => {
    return password.length >= minPasswordLength && password.length <= maxPasswordLength
}



const checkPasswordSymbols = (password : string) => {
    const checker = {
        hasSpecialSymbol : false,
        hasBigLetter : false,
        hasNumber : false,
    }
    const specialSymbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~' // symbols from generate-random passwrd lib(only this symbols can be generated)
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

export const errorInPassword = (password : string) : string => {

    if (typeof password !== 'string'){
        return 'Password must be string'
    }

    if (!checkPasswordLength(password)){
        return `Password must be from ${minPasswordLength} to ${maxPasswordLength} symbols`
    }
    
    if (!checkPasswordSymbols(password)){
        return 'Password must include at least 1 number,1 special symbol and 1 uppercase letter.'
    }

    return ''

}

