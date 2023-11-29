/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
import validator from 'validator'
import { randomBytes } from 'crypto'

const schema = new mongoose.Schema({

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },

  name: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },

  address: String,
  accountNo: String,

  phoneNumber: {
    type: String,
    validate: [validator.isMobilePhone, 'Provide a valid phone number.'],
  },

}, { timestamps: true, toObject: { virtuals: true } })

schema.set('toJSON', {
  virtuals: true,
  transform(_, ret) {
    delete ret._id
    delete ret.__v
  },
})

schema.pre('save', async function accountNo(next) {
  this.accountNo = `CUS-${randomBytes(4).toString('hex')}`
  next()
})

export default mongoose.model('Customer', schema)
