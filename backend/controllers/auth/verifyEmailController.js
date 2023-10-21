import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'
import Token from '../../models/Token.js'
import sendEmail from '../../utils/sendEmail.js'

const domainUrl = process.env.DOMAIN

const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select()
  if (!user) {
    res.status(400)
    throw new Error(`No user with id: ${req.params.userId} was found`)
  }
  if (user.isEmailVerified) {
    res.status(400)
    throw new Error('This email is already verified')
  }
  const token = await Token.findOne({ _userId: user._id, token: req.params.emailToken })
  if (!token) {
    res.status(400)
    throw new Error('Invalid or expired link')
  }
  user.isEmailVerified = true
  await user.save()

  if (user.isEmailVerified) {
    const payload = {
      link: `${domainUrl}/login`,
      name: user.firstName,
    }
    sendEmail(
      user.email,
      'Welcome - Account Verified!',
      payload,
      '/template/welcome.hbs',
    )
    res.redirect('/auth/verify')
  }
})

export default verifyEmail
