'use strict'

const mongoose = require('mongoose')
const { statics } = require('./plugins')

const conversationSchema = new mongoose.Schema({
  subject: {
    type: String,
    trim: true,
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  startDate: {
    type: Date,
    default: new Date().toISOString()
  }
})

// plug in static class methods

conversationSchema.plugin(statics.updateUnreadStatus)
conversationSchema.plugin(statics.findAllWithParticipants)
conversationSchema.plugin(statics.findOneWithParticipants)

/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Conversation', conversationSchema)
