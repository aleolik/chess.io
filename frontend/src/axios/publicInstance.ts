import axios from 'axios'

/* 
    Permissions : For everybody
*/
const publicInstance = axios.create({
    baseURL:"http://localhost:3000/api/user",
    headers : {
        'Content-Type':'application/json',
        'Accept':'application/json'
    },
})

export default publicInstance