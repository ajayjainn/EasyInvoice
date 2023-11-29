/* eslint-disable no-param-reassign */
import mongoose from 'mongoose'
import validator from 'validator'

import bcrypt from 'bcrypt'
import { USER } from '../constants/index.js'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator(value) {
        return /^[A-z][A-z0-9-_]{3,23}$/.test(value)
      },
      message: 'username must be alphanumeric,without special characters.Hyphens and underscores allowed',
    },
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },

  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
    validate: [validator.isAlphanumeric, 'First Name can only have Alphanumeric values. No special characters allowed'],
  },

  lastName: {
    type: String,
    trim: true,
    validate: [validator.isAlphanumeric, 'Last Name can only have Alphanumeric values. No special characters allowed'],
  },

  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  provider: {
    type: String,
    required: true,
    default: 'email',
  },

  active: {
    type: Boolean,
    default: true,
  },

  avatar: String,

  refreshToken: [String],
  googleId: String,
  address: String,
  buisnessName: String,

  phoneNumber: {
    type: String,
    validate: [validator.isMobilePhone, 'Provide a valid phone number.'],
  },

  password: {
    type: String,
    select: false,
    minLength: [6, 'Password must be atleast 6 characters long'],
  },

  roles: {
    type: [String],
    default: [USER],
  },

}, { timestamps: true })

// Hash the password before saving
schema.pre('save', async function hash(next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

schema.methods.comparePassword = async function checkpwd(givenPassword) {
  const res = await bcrypt.compare(givenPassword, this.password)
  return res
}

schema.set('toJSON', {
  virtuals: true,
  transform(_, ret) {
    delete ret._id
    delete ret.__v
    delete ret.refreshToken
  },

})

export default mongoose.model('User', schema)
