import asyncHandler from 'express-async-handler'

const getUserProfile = asyncHandler(async (req, res) => res.json({
  success: true,
  user: req.user,
}))

export default getUserProfile
