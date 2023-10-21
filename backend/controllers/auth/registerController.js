import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'
import Token from '../../models/Token.js'
import sendEmail from '../../utils/sendEmail.js'

const domainUrl = process.env.DOMAIN

const { randomBytes } = await import('crypto')

const registerUser = asyncHandler(async (req, res) => {
  const {
    email, username, firstName, lastName, password, passwordConfirm,
  } = req.body

  if (!email) {
    res.status(400)
    throw new Error('Email is required.')
  }
  if (!username) {
    res.status(400)
    throw new Error('Username is required.')
  }

  if (!firstName) {
    res.status(400)
    throw new Error('FirstName is required.')
  }

  if (!password) {
    res.status(400)
    throw new Error('Password is required.')
  }
  if (password !== passwordConfirm) {
    res.status(400)
    throw new Error('Confirmed password does not match.')
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('A user with this email already exists! Please login instead.')
  }

  const newUser = new User({
    email, username, firstName, lastName, password,
  })
  const registeredUser = await newUser.save()

  if (!registeredUser) {
    res.status(400)
    throw new Error('User could not be registered.')
  }

  const verificationToken = randomBytes(32).toString('hex')
  const emailVerificationToken = await new Token({
    _userId: registeredUser._id,
    token: verificationToken,
  }).save()

  const emailLink = `${domainUrl}/api/v1/auth/verify/${emailVerificationToken.token}/${registeredUser._id}`
  const payload = { name: registeredUser.firstName, link: emailLink }
  await sendEmail(
    registeredUser.email,
    'Account Verification',
    payload,
    './template/accountVerification.hbs',
  )
  res.json({
    success: true,
    message: `A new user, ${registeredUser.firstName} has been registered! 
    Verification email has been sent to ${registeredUser.email}.
    Link valid for the next 15 minutes. 
    `,
  })
})

export default registerUser
