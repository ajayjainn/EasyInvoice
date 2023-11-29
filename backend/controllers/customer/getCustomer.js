import expressAsyncHandler from 'express-async-handler'
import Customer from '../../models/Customer.js'

const getCustomer = expressAsyncHandler(async (req, res) => {
  const id = req.params.id
  const customer = await Customer.findById(id)
  if (!customer) {
    res.status(404)
    throw new Error('No existing Customer with this id')
  }

  if (customer.createdBy.toString() !== req.user.id) {
    res.status(403)
    throw new Error('You are not authorized to view this customer.')
  }
  res.status(200).json({
    success: true,
    customer,
  })
})

export default getCustomer
