import sequilize from '../database/database'

const startDatabase = async() => {
    await sequilize.sync()
}

export default startDatabase