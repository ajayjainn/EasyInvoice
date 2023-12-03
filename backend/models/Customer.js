/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
import validator from 'validator'
import { randomBytes } from 'crypto'
import Invoice from './Invoice.js'

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
    required: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },

  name: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },

  address: String,
  accountNo: String,

  phoneNo: {
    type: String,
    validate: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Provide a valid phone number.'],
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

schema.pre('findOneAndDelete', async function deleteInvoice(next) {
  const id = await this.model.findOne(this.getQuery()).select('_id')
  await Invoice.deleteMany({ customer: id }).exec()
  next()
})

export default mongoose.model('Customer', schema)
