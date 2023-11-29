import expressAsyncHandler from 'express-async-handler'
import Customer from '../../models/Customer.js'

const updateCustomer = expressAsyncHandler(async (req, res) => {
  const id = req.params.id

  const existingCustomer = await Customer.findById(id)
  if (!existingCustomer) {
    res.status(404)
    throw new Error('No existing Customer with this id')
  }

  if (existingCustomer.createdBy.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorized to update this customer\'s information.')
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true },
  )

  if (!updatedCustomer) {
    res.status(400)
    throw new Error('Customer could not be saved.')
  }

  res.status(200).json({
    success: true,
    message: 'Customer updated successfully',
    updatedCustomer,
  })
})

export default updateCustomer
