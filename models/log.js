/* ================================= SETUP ================================= */

const mongoose = require('mongoose')

/* ================================ SCHEMA ================================= */

const logSchema = new mongoose.Schema({

  category: {
    type: String,
    enum: ['engagement_email'],
    required: true
  },

  affectedUsers: [{
    email: { type: String },
    username: { type: String },
    name: { type: String },
    _id: { type: String }
  }],

  actionTaken: {
    type: String,
    retuired: true
  }

},
{
  timestamps: true
})

/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Log', logSchema)
