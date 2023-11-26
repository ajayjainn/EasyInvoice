import asyncHandler from 'express-async-handler'
import Token from '../../models/Token.js'
import User from '../../models/User.js'
import sendEmail from '../../utils/sendEmail.js'

const domainUrl = process.env.DOMAIN

const { randomBytes } = await import('crypto')

export default asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(400)
    throw new Error('An email must be provided.')
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  })

  if (!user) {
    res.status(400)
    throw new Error('No account with this email exists.')
  }

  if (user.isEmailVerified) {
    res.status(400)
    throw new Error('This Email is already verified.')
  }

  const emailVerificationToken = randomBytes(32).toString('hex')

  const token = await new Token({
    _userId: user._id,
    token: emailVerificationToken,
  }).save()

  const link = `${domainUrl}/api/v1/auth/verify/${token.token}/${user._id}`
  await sendEmail(
    user.email,
    'Verify Your Account',
    {
      name: user.firstName,
      link,
    },
    './template/accountVerification.hbs',
  )

  res.json({
    success: true,
    message: `
    Verification email has been sent to ${user.email}.
    Link valid for the next 15 minutes. 
    `,
  })
})
