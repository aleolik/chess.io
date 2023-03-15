import axios from 'axios'

/* 
    Permissions : For logged in user
*/
const userInstance = axios.create({
    baseURL:"http://localhost:3000/api/user",
    timeout : 3000,
    headers : {
        // Authorization : 'TODO'
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    withCredentials : true
})

export default userInstance