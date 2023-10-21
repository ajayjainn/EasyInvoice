import 'dotenv/config'
import fs from 'fs'
import handlebars from 'handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import transporter from '../helpers/emailTransport.js'
import { systemLogs } from './logger.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sendEmail = async (email, subject, payload, template) => {
  const sourceDirectory = fs.readFileSync(
    path.join(__dirname, template),
    'utf-8',
  )

  const compiledTemplate = handlebars.compile(sourceDirectory)

  const emailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject,
    html: compiledTemplate(payload),
  }

  try {
    await transporter.sendMail(emailOptions)
  } catch (error) {
    systemLogs.error(`Email not sent ${error}`)
  }
}

export default sendEmail
