import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'

const getAllInvoices = expressAsyncHandler(async (req, res) => {
  let pageSize = Number(req.query.limit) || 10
  if (pageSize === -1) pageSize = 0
  const page = Number(req.query.page) || 1
  const count = await Invoice.find({ user: req.user.id }).countDocuments()

  const invoices = await Invoice.find({ user: req.user.id })
    .populate('customer', 'name email')
    .populate('user', 'name email')
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    invoices,
  })
})

export default getAllInvoices
