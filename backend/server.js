// import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/api/v1/test', (req, res) => {
  console.log(req.headers)
  res.json({ Hi: 'Welcome to Invoice App' })
})

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  console.log(`Running in ${NODE_ENV} mode on PORT ${PORT}.`)
})
