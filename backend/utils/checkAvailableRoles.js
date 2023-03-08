const {AVAILABLE_ROLES,USER_ROLE} = require('../models/User')

const checkAvailableRoles = (roles) => {

    const obj = {
        roles : roles,
        error : '',
    }

    if (!roles){
        obj.error = 'roles were not provided'
        return obj
    }

    if (!Array.isArray(roles)) {
        obj.error = 'roles can only be an array type'
        return obj
    }
    
    roles.forEach(role => {
        if (!AVAILABLE_ROLES.includes(role)){
            obj.error = `user can not have this role : ${role}`
            return obj
        }
    })

    if (!roles.includes(USER_ROLE)){
        roles.push(USER_ROLE)
    }

    return obj


}

module.exports = checkAvailableRoles