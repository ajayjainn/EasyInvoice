import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'
import Customer from '../../models/Customer.js'

const createInvoice = expressAsyncHandler(async (req, res) => {
  const fields = req.body

  const customer = await Customer.findById(fields.customer).select('createdBy')

  if (!customer) {
    res.status(400)
    throw new Error('Invalid customer id.')
  }

  if (customer.createdBy.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorised to create invoice for this customer.')
  }

  const newInvoice = await new Invoice({
    user: req.user._id,
    customer: customer._id,
    fields,
  }).save()

  if (newInvoice) {
    return res.json({
      success: true,
      invoice: newInvoice,
    })
  }
  res.status(400)
  throw new Error('An error occurred.')
})

export default createInvoice
