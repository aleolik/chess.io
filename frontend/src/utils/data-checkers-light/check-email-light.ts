const errorInEmailFormat = (email : string) => {

    const editedEmail = email.toLowerCase()

    if (editedEmail.includes('@gmail.com')){
        return false
    }


    return true
}

// checks if email is correct,without api call
export const errorInEmail = (email : string) : string => {

    if (typeof email !== 'string'){
        return 'Email must be string'
    }

    if(errorInEmailFormat(email)){
        return 'You need to add @gmail.com to your email adress'
    }

    return ''

}

