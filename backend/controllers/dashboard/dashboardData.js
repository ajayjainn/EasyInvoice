import expressAsyncHandler from 'express-async-handler'
import Invoice from '../../models/Invoice.js'
import Customer from '../../models/Customer.js'

const dashboardData = expressAsyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user._id })
  const totalInvoices = await Invoice.countDocuments({ user: req.user._id })
  const totalCustomers = await Customer.countDocuments({ createdBy: req.user._id })

  const totalSales = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0)
  const amountReceived = invoices.reduce((acc, invoice) => acc + invoice.totalAmountReceived, 0)
  const amountPending = totalSales - amountReceived

  const fullyPaid = invoices.filter((invoice) => invoice.status === 'PAID').length
  const unPaid = totalInvoices - fullyPaid
  const overdue = invoices.filter((invoice) => new Date(invoice.dueDate) > new Date()).length

  return res.json({
    totalSales,
    amountPending,
    amountReceived,
    totalInvoices,
    totalCustomers,
    fullyPaid,
    unPaid,
    overdue,
  })
})
export default dashboardData
