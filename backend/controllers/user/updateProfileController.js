import asyncHandler from 'express-async-handler'
import User from '../../models/User.js'

const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    username, firstName, lastName, avatar, address, phoneNumber, buisnessName,
  } = req.body

  const fieldsToUpdate = {}

  if (username) fieldsToUpdate.username = username
  if (firstName) fieldsToUpdate.firstName = firstName
  if (lastName) fieldsToUpdate.lastName = lastName
  if (avatar) fieldsToUpdate.avatar = avatar
  if (address) fieldsToUpdate.address = address
  if (phoneNumber) fieldsToUpdate.phoneNumber = phoneNumber
  if (buisnessName) fieldsToUpdate.buisnessName = buisnessName

  const updatedUser = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  return res.status(201).json({
    success: true,
    message: 'Account details updated successfully.',
    updatedUser,
  })
})

export default updateUserProfile
