import axios from 'axios'

/* 
    Permissions : For admin
*/
const adminInstance = axios.create({
    baseURL:"http://localhost:3000/api/user/admin",
})

export default adminInstance