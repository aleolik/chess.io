const Router = require('express')
const userRotuer = require('./userRouter.js')
const historyRouter = require('./historyRouter.js')
const matchRouter = require('./matchRouter.js')

const router = new Router()

router.use('/user',userRotuer)
router.use('/history',historyRouter)
router.use('/match',matchRouter)

module.exports = router