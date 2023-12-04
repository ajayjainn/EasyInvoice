import express from 'express'
import getUserProfile from '../controllers/user/profileController.js'
import updateUserProfile from '../controllers/user/updateProfileController.js'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import deleteAccount from '../controllers/user/deleteMyAccountController.js'
import deleteUserAccount from '../controllers/user/deleteUserAccount.js'
import deactivateUserAccount from '../controllers/user/deactivateUserAccount.js'
import getAllUsers from '../controllers/user/getAllUsersController.js'
import role from '../middleware/roleMiddleware.js'
import activateUserAccount from '../controllers/user/activateUserAccount.js'
import dashboardData from '../controllers/dashboard/dashboardData.js'

const router = express.Router()

router.get('/profile', checkAuth, getUserProfile)
router.patch('/profile', checkAuth, updateUserProfile)
router.delete('/profile', checkAuth, deleteAccount)
router.delete('/:id', checkAuth, role.checkRole(role.ROLES.Admin), deleteUserAccount)
router.patch('/:id/deactivate', checkAuth, role.checkRole(role.ROLES.Admin), deactivateUserAccount)
router.patch('/:id/activate', checkAuth, role.checkRole(role.ROLES.Admin), activateUserAccount)
router.get('/all', checkAuth, role.checkRole(role.ROLES.Admin), getAllUsers)
router.get('/dashboard', checkAuth, dashboardData)

export default router
