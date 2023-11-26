import asyncHandler from 'express-async-handler'
import Token from '../../models/Token.js'
import User from '../../models/User.js'
import sendEmail from '../../utils/sendEmail.js'

const domainUrl = process.env.DOMAIN

const { randomBytes } = await import('crypto')

export const resetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    res.status(400)
    throw new Error('Please provide an email')
  }
  const user = await User.findOne({ email }).exec()
  if (!user) {
    res.status(400)
    throw new Error('No account with this email exists')
  }

  if (!user.isEmailVerified) {
    res.status(403)
    throw new Error("You can't request a password change because your email isn't verified")
  }
  const token = await new Token({
    _userId: user._id,
    token: randomBytes(32).toString('hex'),
  }).save()

  const link = `${domainUrl}/auth/reset_password/?emailToken=${token.token}&userId=${user._id.toString()}`

  const payload = {
    name: user.firstName,
    link,
  }

  await sendEmail(
    user.email,
    'Password Reset Request',
    payload,
    './template/requestResetPassword.hbs',
  )

  res.json({
    success: true,
    message: `A password reset request has been sent to ${user.email}`,
  })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const {
    password, passwordConfirm, userId, emailToken,
  } = req.body

  if (!password || (password !== passwordConfirm)) {
    res.status(400)
    throw new Error('Please fill all fields')
  }

  const passwordResetToken = await Token.findOne({ _userId: userId, token: emailToken }).exec()
  if (!passwordResetToken) {
    res.status(400)
    throw new Error('Token invalid or expired.')
  }
  const user = await User.findById(passwordResetToken._userId).exec()
  if (user) {
    user.password = password
    user.save()

    sendEmail(
      user.email,
      'Your Password Has Been Changed',
      { name: user.firstName },
      './template/resetPasswordSuccess.hbs',
    )

    return res.json({
      success: true,
      message: `Hey ${user.firstName}, your password has been changed successfully! You can now login with your new credentials.`,
    })
  }

  res.status(400)
  throw new Error('Invalid token')
})
