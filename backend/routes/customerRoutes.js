import express from 'express'
import createCustomerRoute from '../controllers/customer/createCustomer.js'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import updateCustomer from '../controllers/customer/updateCustomer.js'
import deleteCustomer from '../controllers/customer/deleteCustomer.js'
import getAllCustomers from '../controllers/customer/getAllCustomers.js'
import getCustomer from '../controllers/customer/getCustomer.js'

const router = express.Router()

router.post('/', checkAuth, createCustomerRoute)
router.patch('/:id', checkAuth, updateCustomer)
router.delete('/:id', checkAuth, deleteCustomer)
router.get('/', checkAuth, getAllCustomers)
router.get('/:id', checkAuth, getCustomer)

export default router
