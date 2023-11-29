import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'

const updateInvoice = expressAsyncHandler(async (req, res) => {
  const fields = req.body
  const id = req.params.id

  if (fields.user || fields.customer) {
    res.status(400)
    throw new Error('Cannot update user or customer.')
  }

  const invoice = await Invoice.findById(id)
  if (!invoice) {
    res.status(404)
    throw new Error('Invoice doesn\'nt exist.')
  }

  if (invoice.user.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorised to update this invoice.')
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    id,
    { fields },
    { new: true, runValidators: true },
  )

  if (updatedInvoice) {
    return res.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: updatedInvoice,
    })
  }

  res.status(400)
  throw new Error('An error occurred.')
})

export default updateInvoice
