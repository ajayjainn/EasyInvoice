import expressAsyncHandler from 'express-async-handler'
import Customer from '../../models/Customer.js'

const createCustomer = expressAsyncHandler(async (req, res) => {
  const {
    email, name, address, accountNo, phoneNo,
  } = req.body

  const newCustomer = new Customer({
    name, email, address, accountNo, phoneNo, createdBy: req.user._id,
  })

  const existingCus = await Customer.findOne({ email, createdBy: req.user._id })
  if (existingCus) {
    res.status(400)
    throw new Error('Customer already exists.')
  }

  const createdCustomer = await newCustomer.save()
  if (!createdCustomer) {
    res.status(400)
    throw new Error('Customer could not be saved.')
  }

  res.status(200).json({
    success: true,
    message: 'Customer created successfully',
    createdCustomer,
  })
})

export default createCustomer
