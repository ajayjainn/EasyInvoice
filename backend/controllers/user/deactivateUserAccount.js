import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const deactivateUserAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const user = await User.findById(userId)
  if (user) {
    user.active = false
    const updatedUser = await user.save()

    return res.json({
      success: true,
      updatedUser,
    })
  }
  res.status(404)
  throw new Error('User not found')
})

export default deactivateUserAccount
