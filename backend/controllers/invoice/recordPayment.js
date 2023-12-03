import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'

const recordPayment = expressAsyncHandler(async (req, res) => {
  const invoiceId = req.params.id
  const invoice = await Invoice.findById(invoiceId)
  if (!invoice || invoice.user.toString() !== req.user.id) {
    res.status(404)
    throw new Error('Invoice not found.')
  }

  invoice.payments = invoice.payments.concat(req.body)
  invoice.totalAmountReceived += Number(req.body.amount)
  invoice.status = Math.round(invoice.totalAmountReceived) === Math.round(invoice.totalAmount)
    ? 'PAID'
    : 'PARTIALLY PAID'

  await invoice.save()
  res.json({
    success: true,
    message: 'Payment recorded successfully.',
  })
})

export default recordPayment
