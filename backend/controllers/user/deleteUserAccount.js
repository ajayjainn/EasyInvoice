import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.params.id
  const user = await User.findById(userId)
  if (user) {
    await User.findByIdAndDelete(user._id)
    return res.json({
      success: true,
      message: `User, ${user.firstName} was deleted successfully`,
    })
  }
  res.status(404)
  throw new Error('User not found')
})

export default deleteUserAccount
