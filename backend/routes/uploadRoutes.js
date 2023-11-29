import express from 'express'
import cloudinaryUploader from '../config/cloudinaryConfig.js'
import upload from '../helpers/multer.js'

const router = express.Router()

router.patch('/', upload.single('logo'), async (req, res) => {
  const localFilePath = req.file.path
  console.log(req.file)
  const result = await cloudinaryUploader(localFilePath)
  res.json(result.url)
})

export default router
