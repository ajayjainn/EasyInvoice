import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id
  await User.findByIdAndDelete(userId)
  res.json({
    success: true,
    message: 'Account deleted successfully',
  })
})

export default deleteAccount
