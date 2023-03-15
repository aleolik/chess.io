
const ApiError = require("../error/ApiError")
const path = require('path')
const fs = require('fs')
const {getDirByUsername} = require('../utils/fileOperations')

const getType = (imgName=null) => {
    const availableTypes = {
        png : 'png',
        jpg : 'jpg',
        jpeg : 'jpeg',
        
    }

    if (imgName.includes(availableTypes.png)){
        return '.'+availableTypes.png
    }
    if (imgName.includes(availableTypes.jpg)){
        return '.'+availableTypes.jpg
    }
    if (imgName.includes(availableTypes.jpeg)){
        return '.'+availableTypes.jpeg
    }

    return null
}
const ImgHandler = (file,username) => {

    if (!file) return null;


    username = username.trim()

    const fileName = file.name.toLowerCase().trim()

    const fileType = getType(fileName)

    if (!fileType){
        return null
    }

    // creteas new folder for user if not exists!
    const newPath = getDirByUsername(username)
    if(!fs.existsSync(newPath)){
        fs.mkdirSync(newPath)
    }
    const filePath = path.resolve(__dirname,'..','static',username,fileName)

    console.log(filePath)

    return filePath
}

module.exports = ImgHandler