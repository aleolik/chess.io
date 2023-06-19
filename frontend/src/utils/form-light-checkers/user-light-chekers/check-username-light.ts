const minUsernameLength  : number = 2
const maxUsernameLength : number = 45

const checkUsernameLength = (username : string) : boolean => {
    // check if username's length is acceptable
    return username.length >= minUsernameLength && username.length <= maxUsernameLength
}

// function for checking if
export const check_username_light = (username : string) : string => {

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
