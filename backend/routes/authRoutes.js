import express from 'express'
import registerUser from '../controllers/auth/registerController.js'
import verifyEmail from '../controllers/auth/verifyEmailController.js'
import { loginLimiter } from '../middleware/apiLimiterMidllerware.js'
import loginRouter from '../controllers/auth/loginController.js'

const router = express.Router()

router.post('/register', registerUser)
router.get('/verify/:emailToken/:userId', verifyEmail)
router.post('/login', loginLimiter, loginRouter)

export default router
