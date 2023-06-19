const path = require('path')

const getDirByUsername = (username) => {
    return path.resolve(__dirname,'..','static',username)
}



module.exports = {
    getDirByUsername
}