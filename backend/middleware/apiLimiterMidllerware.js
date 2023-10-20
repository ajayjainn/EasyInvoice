import rateLimit from 'express-rate-limit'
import { systemLogs } from '../utils/logger.js'

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Too many requests from this ip address. Please try again after 15 minutes.',
  },
  handler: (req, res, _, options) => {
    systemLogs.error(`Too many requests: 
    ${options.message.message}\t
    ${req.url}\t
    ${req.method}\t 
    ${req.headers.origin}`)
    return res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 20,
  message: {
    message: 'Too many login attempts. Please try again after 30 minutes',
  },
  handler: (req, res, _, options) => {
    systemLogs.error(`Too many requests: 
    ${options.message.message}\t
    ${req.url}\t
    ${req.method}\t 
    ${req.headers.origin}`)
    return res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
})
