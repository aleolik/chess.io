const badRequest = (data=null) : string => {
    if (typeof data === 'string') return `${data} was not provided!`
    return 'Bad Request!'
}
const Unauthorized = (noToken : boolean=true,data=null) : string => {
    if (typeof data === 'string') return `${data} was not provided`
    if (noToken) return 'Token was not provided or incorrect!'
    return 'User is Unauthorized'
}

const errorMessages = {
    Unauthorized : Unauthorized,
    BadRequest : badRequest,
    Forbidden : 'Forbidden'
}


module.exports = errorMessages