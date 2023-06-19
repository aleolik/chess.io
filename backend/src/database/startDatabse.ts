
import {userModel} from '../models/User'
import matchModel from '../models/Match'
import historyModel from '../models/History'
import sequilize from '../database/database'




const startDB = async() => {
    await sequilize.sync()
}

const connectToDB = () => {
    userModel.hasOne(historyModel)
    historyModel.hasMany(matchModel)
    // Match.hasMany(User)


    // sync process
    startDB()
    
}



export default connectToDB