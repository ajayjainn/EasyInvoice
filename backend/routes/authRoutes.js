import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import registerUser from '../controllers/auth/registerController.js'
import verifyEmail from '../controllers/auth/verifyEmailController.js'
import { loginLimiter } from '../middleware/apiLimiterMidllerware.js'
import loginRouter from '../controllers/auth/loginController.js'
import newAccessToken from '../controllers/auth/refreshTokenController.js'
import resendEmailToken from '../controllers/auth/resendVerifyEmailController.js'
import { resetPassword, resetPasswordRequest } from '../controllers/auth/passwordResetController.js'
import logoutRoute from '../controllers/auth/logoutController.js'
import User from '../models/User.js'

const router = express.Router()

router.post('/register', registerUser)
router.get('/verify/:emailToken/:userId', verifyEmail)
router.post('/login', loginLimiter, loginRouter)
router.get('/new_access_token', newAccessToken)
router.post('/resend_email_token', resendEmailToken)
router.post('/reset_password_request', resetPasswordRequest)
router.post('/reset_password', resetPassword)
router.get('/logout', logoutRoute)

router.get('/google', passport.authenticate(
  'google',
  {
    session: false,
    scope: ['email', 'profile'],
    accessType: 'offline',
    prompt: 'consent',
  },
))

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    const existingUser = await User.findById(req.user.id)
    const payload = {
      id: req.user.id,
      roles: existingUser.roles,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      username: existingUser.username,
      provider: existingUser.provider,
      avatar: existingUser.avatar,
    }
    jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: '20m' },
      (err, token) => {
        if (err) {
          console.log(err)
          res.status(500).json({ message: 'Something went wrong' })
        }
        const embedJwt = `
          <html>
          <script>
          window.localStorage.setItem('googleToken', '${token}')
          window.location.href = '/dashboard'
          </script>
          </html>
          `
        return res.send(embedJwt)
      },
    )
  },
)

export default router
