import express from 'express'
import getUserProfile from '../controllers/user/profileController.js'
import updateUserProfile from '../controllers/user/updateProfileController.js'
import checkAuth from '../middleware/checkAuthMiddleware.js'
import deleteAccount from '../controllers/user/deleteAccountController.js'

const router = express.Router()

router.get('/profile', checkAuth, getUserProfile)
router.patch('/profile', checkAuth, updateUserProfile)
router.delete('/profile', checkAuth, deleteAccount)

export default router
