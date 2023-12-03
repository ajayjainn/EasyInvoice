import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'

const getInvoice = expressAsyncHandler(async (req, res) => {
  const id = req.params.id
  if (!id) {
    res.status(404)
    throw new Error('No id provided.')
  }

  const invoice = await Invoice.findById(id)
    .populate('customer', 'name email')
    .populate('user', 'name email')

  if (!invoice) {
    res.status(404)
    throw new Error('Invoice doesn\'nt exist.')
  }

  if (invoice.user._id.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorised to view this invoice.')
  }

  res.json({
    success: true,
    invoice,
  })
})

export default getInvoice
