import 'dotenv/config'
import nodemailer from 'nodemailer'

// eslint-disable-next-line import/no-mutable-exports
let transporter
if (process.env.NODE_ENV === 'development') {
  transporter = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
  })
} else if (process.env.NODE_ENV === 'production') {
  // todo
  nodemailer.createTransport()
}

export default transporter
