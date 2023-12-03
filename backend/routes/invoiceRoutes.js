import express from 'express'
import createInvoice from '../controllers/invoice/createInvoice.js'
import getInvoice from '../controllers/invoice/getInvoice.js'
import getAllInvoices from '../controllers/invoice/getAllInvoices.js'
import deleteInvoice from '../controllers/invoice/deleteInvoice.js'
import updateInvoice from '../controllers/invoice/updateInvoice.js'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import recordPayment from '../controllers/invoice/recordPayment.js'
import emailInvoicePdf from '../controllers/invoice/emailInvoicePdf.js'

const router = express.Router()

router.post('/', checkAuth, createInvoice)
router.patch('/:id', checkAuth, updateInvoice)
router.delete('/:id', checkAuth, deleteInvoice)
router.get('/', checkAuth, getAllInvoices)
router.get('/:id', checkAuth, getInvoice)
router.post('/:id/sendInvoice', checkAuth, emailInvoicePdf)

router.post('/:id/payment', checkAuth, recordPayment)

export default router
