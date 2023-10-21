import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

export default asyncHandler(async (req, res) => {
  const cookies = req.cookies
  const options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'None',
  }

  if (!cookies?.jwt) {
    res.status(400)
    throw new Error('No cookie provided')
  }

  const refreshToken = cookies.jwt
  res.clearCookie('jwt', options)
  const existingUser = await User.findOne({ refreshToken }).exec()

  if (!existingUser) {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
      if (err) {
        res.status(400)
        throw new Error('Invalid token')
      }
      const hackedUser = await User.findById(decoded.id).exec()
      if (hackedUser) {
        hackedUser.refreshToken = []
        hackedUser.save()
      }
    })
  }

  existingUser.refreshToken = existingUser.refreshToken.filter((token) => token !== refreshToken)
  await existingUser.save()
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})
