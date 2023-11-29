/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
import { randomBytes } from 'crypto'

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  documentNo: Number,
  dueDate: Date,
  status: {
    type: String,
    default: 'NOT PAID',
    enum: ['NOT PAID', 'PAID', 'PARTIALLY PAID'],
  },
  subTotal: Number,
  discount: Number,
  tax: Number,
  totalAmount: Number,
  totalAmountReceived: Number,

  billingItems: [{
    name: String,
    rate: Number,
    quantity: Number,
  }],

  payments: [{
    amount: Number,
    paymentDate: Date,
    paymentMode: {
      type: String,
      default: 'CASH',
      enum: ['CASH', 'CHEQUE', 'NEFT', 'UPI', 'OTHERS'],
    },
    remarks: String,
  }],
}, { timestamps: true })

invoiceSchema.set('toJSON', {
  virtuals: true,
  transform(_, ret) {
    delete ret._id
    delete ret.__v
  },
})

invoiceSchema.pre('save', async function accountNo(next) {
  this.documentNo = `INV-${randomBytes(4).toString('hex')}`
  next()
})

export default mongoose.model('Invoice', invoiceSchema)
