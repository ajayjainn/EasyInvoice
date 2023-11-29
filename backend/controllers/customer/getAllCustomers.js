import expressAsyncHandler from 'express-async-handler'
import Customer from '../../models/Customer.js'

const getAllCustomers = expressAsyncHandler(async (req, res) => {
  let pageSize = Number(req.query.limit) || 10
  if (pageSize === -1) pageSize = 0
  const page = Number(req.query.page) || 1
  const count = await Customer.find({ createdBy: req.user.id }).countDocuments()

  const customers = await Customer
    .find({ createdBy: req.user.id })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.status(200).json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    customers,
  })
})

export default getAllCustomers
