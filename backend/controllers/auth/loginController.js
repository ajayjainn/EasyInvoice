import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import { systemLogs } from '../../utils/logger.js'

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Provide a email and a password!')
  }
  const existingUser = await User.findOne({ email }).select('+password')
  if (!existingUser || !(await existingUser.comparePassword(password))) {
    res.status(401)
    systemLogs.error(`Incorrect email or password${await existingUser.comparePassword(password)})}`)
    throw new Error('Incorrect email or password')
  }

  if (!existingUser.isEmailVerified) {
    res.status(400)
    throw new Error("Your account isn't verified")
  }

  if (!existingUser.active) {
    res.status(403)
    throw new Error('Account is deactivated')
  }

  const accessToken = jwt.sign(
    {
      id: existingUser._id,
      roles: existingUser.roles,
    },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: '1h' },
  )

  const newRefreshToken = jwt.sign(
    {
      id: existingUser._id,
    },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: '1d' },
  )

  const cookies = req.cookies

  const options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'None',
  }

  let newRefreshTokenArray = !cookies?.jwt
    ? existingUser.refreshToken
    : existingUser.refreshToken.filter((ref) => ref !== cookies.jwt)

  if (cookies?.jwt) {
    const refreshToken = cookies.jwt
    const existingRefreshToken = await User.findOne({
      refreshToken,
    }).exec()
    if (!existingRefreshToken) {
      newRefreshTokenArray = []
    }
    res.clearCookie('jwt', options)
  }
  existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
  await existingUser.save()

  res.cookie('jwt', newRefreshToken, options)

  res.json({
    success: true,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    username: existingUser.username,
    provider: existingUser.provider,
    avatar: existingUser.avatar,
    accessToken,
  })
})

export default loginUser
