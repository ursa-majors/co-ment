'use strict'

const mongoose = require('mongoose')
const { statics } = require('./plugins')

const postSchema = new mongoose.Schema({
  active: { type: Boolean, default: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  availability: { type: String, trim: true },
  body: { type: String, required: true, trim: true },
  excerpt: { type: String, trim: true },
  keywords: { type: [String], required: true },
  role: {
    type: String,
    lowercase: true,
    enum: ['mentor', 'mentee'],
    default: 'mentee',
    trim: true
  },
  title: { type: String, required: true, trim: true },
  deleted: { type: Boolean, default: false },
  meta: {
    views: { type: Number, default: 0, min: 0 },
    likes: { type: Number, default: 0, min: 0 }
  },
  updatedAt: { type: Date },
  createdAt: { type: Date }
})

// plug in static class methods

postSchema.plugin(statics.findPosts)
postSchema.plugin(statics.updatePost)
postSchema.plugin(statics.incrementViews)
postSchema.plugin(statics.deletePost)
postSchema.plugin(statics.deletePostsByAuthor)

// exports

module.exports = mongoose.model('Post', postSchema)
