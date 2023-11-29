import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const cloudinaryUploader = async (localFilePath) => {
  const publicId = `easyinvoice/${localFilePath}`
  try {
    const result = await cloudinary.uploader.upload(
      localFilePath,
      {
        public_id: publicId,
      },
    )
    fs.unlinkSync(localFilePath)
    return {
      message: 'Success',
      url: result.url,
    }
  } catch (err) {
    return {
      message: 'Failure',
      error: err,
    }
  }
}

export default cloudinaryUploader
