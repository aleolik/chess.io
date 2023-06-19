import axios from 'axios'

/* 
    Permissions : For everybody
*/
const publicInstance = axios.create({
    baseURL:"http://localhost:5000/api",
    headers : {
        'Content-Type': 'application/json',
    },
})

export default publicInstance