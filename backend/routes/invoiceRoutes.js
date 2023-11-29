import express from 'express'
import createInvoice from '../controllers/invoice/createInvoice.js'
import getInvoice from '../controllers/invoice/getInvoice.js'
import getAllInvoices from '../controllers/invoice/getAllInvoices.js'
import deleteInvoice from '../controllers/invoice/deleteInvoice.js'
import updateInvoice from '../controllers/invoice/updateInvoice.js'
import checkAuth from '../middleware/checkAuthMiddleware.js'

const router = express.Router()

router.post('/', checkAuth, createInvoice)
router.patch('/:id', checkAuth, updateInvoice)
router.delete('/:id', checkAuth, deleteInvoice)
router.get('/', checkAuth, getAllInvoices)
router.get('/:id', checkAuth, getInvoice)

export default router
