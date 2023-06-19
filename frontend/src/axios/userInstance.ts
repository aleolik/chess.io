import axios from 'axios'
import { checkTokenExpireStatus } from './checkTokenExpireStatus'

/* 
    Permissions : For logged in user
*/
const userInstance = axios.create({
    baseURL:"http://localhost:5000/api/user",
    timeout : 3000,
    headers : {
        // Authorization : 'TODO'
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    withCredentials : true
})

userInstance.interceptors.request.use(checkTokenExpireStatus)


export default userInstance