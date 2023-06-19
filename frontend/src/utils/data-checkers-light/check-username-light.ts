// username can be from minUsernameLength to maxUsernameLength symbols length
const minUsernameLength = 4
const maxUsernameLength = 45


const checkUsernameLength = (username : string) => {
    // check if username's length is acceptable
    return username.length >= minUsernameLength && username.length <= maxUsernameLength
}


// function that check if user with provided username can be created
export const errorInUsername = (username : string) : string => {
    
    if (typeof username !== 'string'){
        return 'Username must be string'
    }
        
    if (!checkUsernameLength(username)){
        return `Username must be from ${minUsernameLength} to ${maxUsernameLength} symbols`
    }

    return ''
}