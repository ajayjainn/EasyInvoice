import expressAsyncHandler from 'express-async-handler'
import Customer from '../../models/Customer.js'

const getAllCustomers = expressAsyncHandler(async (req, res) => {
  let pageSize = Number(req.query.limit)
  const page = Number(req.query.page) || 1
  const count = await Customer.find({ createdBy: req.user.id }).countDocuments()
  if (!pageSize || pageSize === -1) pageSize = count

  const customers = await Customer
    .find({ createdBy: req.user.id })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.status(200).json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / (pageSize || count)),
    customers,
  })
})

export default getAllCustomers
