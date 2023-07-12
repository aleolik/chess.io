import axios from 'axios'

/* 
    Permissions : For logged in user
*/
const userInstance = axios.create({
    baseURL:"http://localhost:5000/api",
    timeout : 3000,
    headers : {
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
    withCredentials : true
})



export default userInstance