import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const getAllUsers = asyncHandler(async (req, res) => {
  let pageSize = Number(req.query.limit)
  const page = Number(req.query.page) || 1
  const count = await User.countDocuments()
  if (!pageSize || pageSize === -1) pageSize = count
  const users = await User
    .find()
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  return res.json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    users,
  })
})

export default getAllUsers
