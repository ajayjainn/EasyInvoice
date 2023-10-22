import express from 'express'
import getUserProfile from '../controllers/user/profileController.js'
import updateUserProfile from '../controllers/user/updateProfileController.js'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import deleteAccount from '../controllers/user/deleteAccountController.js'
import getAllUsers from '../controllers/user/getAllUsersController.js'
import role from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/profile', checkAuth, getUserProfile)
router.patch('/profile', checkAuth, updateUserProfile)
router.delete('/profile', checkAuth, deleteAccount)
router.get('/all', checkAuth, role.checkRole(role.ROLES.Admin), getAllUsers)

export default router
