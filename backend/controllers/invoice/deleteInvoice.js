import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'

const deleteInvoice = expressAsyncHandler(async (req, res) => {
  const id = req.params.id

  const invoice = await Invoice.findOneAndDelete({ _id: id, user: req.user.id })
  if (!invoice) {
    res.status(400)
    throw Error('Invoice Not found')
  }
  res.json({
    success: true,
    message: 'Invoice deleted successfully.',
  })
})

export default deleteInvoice
