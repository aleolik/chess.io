import axios from 'axios'

/* 
    Permissions : For everybody
*/
const publicInstance = axios.create({
    baseURL:"http://localhost:5000/api",
    timeout : 3000,
    headers : {
        'Content-Type': 'application/json',
    },
})

export default publicInstance