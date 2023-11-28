import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

const newAccessToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) {
    return res.sendStatus(401)
  }
  const refreshToken = cookies.jwt
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'None',
  }
  res.clearCookie('jwt', options)

  const existingUser = await User.findOne({ refreshToken }).exec()
  if (!existingUser) {
    // eslint-disable-next-line consistent-return
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403)
      }

      const compromisedAccount = await User.findById(decoded.id).exec()
      compromisedAccount.refreshToken = []
      await compromisedAccount.save()
    })

    return res.sendStatus(403)
  }
  const newRefreshTokenArray = existingUser.refreshToken.filter((tk) => tk !== refreshToken)
  return jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        existingUser.refreshToken = [...newRefreshTokenArray]
        await existingUser.save()
        return res.sendStatus(403)
      }
      if (decoded.id !== existingUser._id.toString()) {
        return res.sendStatus(403)
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

      existingUser.refreshToken = [...newRefreshTokenArray, newRefreshToken]
      await existingUser.save()

      res.cookie('jwt', newRefreshToken, options)

      return res.json({
        success: true,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        username: existingUser.username,
        provider: existingUser.provider,
        avatar: existingUser.avatar,
        accessToken,
      })
    },
  )
})

export default newAccessToken
