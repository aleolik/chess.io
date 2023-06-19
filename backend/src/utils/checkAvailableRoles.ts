import {AVAILABLE_ROLES} from '../models/User'

const checkAvailableRoles = (roles : Array<AVAILABLE_ROLES>) => {

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
        if (!(role in AVAILABLE_ROLES)){
            obj.error = `user can not have this role : ${role}`
            return obj
        }
    })

    if (!(AVAILABLE_ROLES.USER_ROLE in roles)){
        roles.push(AVAILABLE_ROLES.USER_ROLE)
    }

    return obj


}

export default checkAvailableRoles