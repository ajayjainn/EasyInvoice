import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const checkAuth = asyncHandler(async (req, res, next) => {
  let jwtToken
  const authHeader = req.headers.authorization || req.headers.Authorization
  if (authHeader && authHeader.startsWith('Bearer')) {
    jwtToken = authHeader.split(' ')[1]
  } else {
    res.sendStatus(401)
  }
  jwt.verify(
    jwtToken,
    process.env.JWT_ACCESS_SECRET_KEY,
    async (err, decoded) => {
      if (err) return res.sendStatus(403)
      req.user = await User.findById(decoded.id).select('-password')
      req.roles = decoded.roles
      return next()
    },
  )
})

export default checkAuth
