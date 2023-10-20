import mongoose from 'mongoose'

const schema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: ['User'],
  },

  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    require: true,
    expires: 900,
  },
})

const Token = mongoose.model('Token', schema)

export default Token
