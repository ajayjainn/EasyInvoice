import fs from 'fs'
import multer from 'multer'
import path from 'path'

if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads')
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads')
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}`)
  },
})

const checkImage = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/
  const extName = fileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  )
  const mimeType = fileTypes.test(file.mimetype)
  if (extName && mimeType) {
    cb(null, true)
  } else {
    cb('Unsupported file type.', false)
  }
}
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: checkImage,
})

export default upload
