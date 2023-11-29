import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const activateUserAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const user = await User.findById(userId)
  if (user) {
    user.active = true
    const updatedUser = await user.save()

    return res.json({
      success: true,
      message: `${user.firstName}'s account activated successfully.`,
      updatedUser,
    })
  }
  res.status(404)
  throw new Error('User not found')
})

export default activateUserAccount
