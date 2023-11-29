import passport from 'passport'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import connectionToDB from './config/connectDB.js'
import { morganMiddleware, systemLogs } from './utils/logger.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { apiLimiter } from './middleware/apiLimiterMidllerware.js'
import googleAuth from './config/passportSetup.js'

await connectionToDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(passport.initialize())
googleAuth()

app.use(cookieParser())

app.use(mongoSanitize())

app.use(morganMiddleware)

app.get('/api/v1/test', (req, res) => {
  res.json({ Hi: 'Welcome to Invoice App' })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', apiLimiter, userRoutes)
app.use('/api/v1/customers', apiLimiter, customerRoutes)
app.use('/api/v1/invoices', apiLimiter, invoiceRoutes)

app.use(errorHandler)
app.use(notFound)

const PORT = process.env.PORT || 1997
const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  console.log(`Running in ${NODE_ENV} mode on PORT ${PORT}.`)
  systemLogs.info(`Running in ${NODE_ENV} mode on PORT ${PORT}.`)
})
