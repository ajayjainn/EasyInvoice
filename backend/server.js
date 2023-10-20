// import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import connectionToDB from './config/connectDB.js'
import { morganMiddleware, systemLogs } from './utils/logger.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import { checkAuth } from './middleware/checkAuthMiddleware.js'

await connectionToDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(mongoSanitize)

app.use(morganMiddleware)

app.get('/api/v1/test', (req, res) => {
  res.json({ Hi: 'Welcome to Invoice App' })
})


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 1997
const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  console.log(`Running in ${NODE_ENV} mode on PORT ${PORT}.`)
  systemLogs.info(`Running in ${NODE_ENV} mode on PORT ${PORT}.`)
})
