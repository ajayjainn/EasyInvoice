import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1
  const count = await User.countDocuments()
  const users = await User
    .find()
    .sort({ createdAt: -1 })
    .limit(10)
    .skip(pageSize * (page - 1))
    .lean()

  return res.json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    users,
  })
})

export default getAllUsers
