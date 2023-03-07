const User = require('../models/User.js')
const Match = require('../models/Match.js')
const History = require('../models/History.js')
const sequilize = require('./database.js')




const startDB = async() => {
    await sequilize.sync()
}

const connectToDB = () => {
    User.hasOne(History)
    History.hasMany(Match)
    // Match.hasMany(User)


    // sync process
    startDB()
    
}



module.exports = connectToDB