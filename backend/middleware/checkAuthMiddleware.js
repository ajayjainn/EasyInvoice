import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const checkAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    return res.sendStatus(401)
  }
  const jwtToken = authHeader.split(' ')[1]
  return jwt.verify(
    jwtToken,
    process.env.JWT_ACCESS_SECRET_KEY,
    async (err, decoded) => {
      if (err) return res.sendStatus(403)
      req.user = await User.findById(decoded.id).select('-password')
      req.roles = req.user.roles
      return next()
    },
  )
})

export default checkAuth
