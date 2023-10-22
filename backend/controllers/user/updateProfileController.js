import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    username, firstName, lastName, avatar, address,
  } = req.body

  const fieldsToUpdate = {}

  if (username) fieldsToUpdate.username = username
  if (firstName) fieldsToUpdate.firstName = firstName
  if (lastName) fieldsToUpdate.lastName = lastName
  if (avatar) fieldsToUpdate.avatar = avatar
  if (address) fieldsToUpdate.address = address

  const updatedUser = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  return res.status(201).json({ success: true, updatedUser })
})

export default updateUserProfile
