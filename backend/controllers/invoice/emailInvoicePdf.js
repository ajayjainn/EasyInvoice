import expressAsyncHandler from 'express-async-handler'
import pdf from 'html-pdf'
import sendEmail from '../../utils/sendEmail.js'
import Invoice from '../../models/Invoice.js'
import pdfTemplate from '../../utils/pdfTemplates/invoice.js'

const options = { format: 'Letter' }

const emailInvoicePdf = expressAsyncHandler(async (req, res) => {
  const invoiceId = req.params.id
  const invoice = await
  Invoice
    .findById(invoiceId)
    .populate('customer', 'name email address')
    .populate('user', 'name email address buisnessName avatar')

  if (!invoice) {
    res.status(404)
    throw new Error('Invoice doesn\'nt exist.')
  }

  if (invoice.user._id.toString() !== req.user.id) {
    res.status(403)
    throw new Error('Not authorised to view this invoice.')
  }
  console.log(invoice)
  const invoiceData = {
    invoice: {
      ...invoice._doc,
      dueDate: invoice.dueDate.toDateString(),
      createdAt: invoice.createdAt.toDateString(),
    },
  }

  const html = pdfTemplate(invoiceData.invoice)

  console.log(invoiceData)
  console.log(invoiceData.invoice.items)

  pdf.create(html, {
    ...options,
    childProcessOptions: {
      env: {
        OPENSSL_CONF: '/dev/null',
      },
    },
  }).toFile('uploads/myDocument.pdf', (err, resp) => {
    if (err) return console.log(err)
    return console.log(resp)
  })

  try {
    await sendEmail(
      invoice.customer.email,
      'INVOICE',
      { name: invoice.customer.name, documentNo: invoice.invoiceNo },
      './template/invoice.hbs',
      [{
        filename: 'invoice.pdf',
        path: 'uploads/myDocument.pdf',
      }],
    )
    res.json({
      message: 'Invoice successfully send to Customer\'s email',
    })
  } catch (error) {
    console.log('Error', error)
    throw new Error(error)
  }
})
export default emailInvoicePdf
