const badRequest = (data=null) => {
    if (typeof data === 'string') return `${data} was not provided!`
    return 'Bad Request!'
}
const Unauthorized = (noToken=true,data=null) => {
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