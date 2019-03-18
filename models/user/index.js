'use strict'

require('dotenv').config()
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const { statics, methods } = require('./plugins')

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  name: { type: String, trim: true },
  ghUserName: { type: String, trim: true },
  ghProfile: Object,
  avatarUrl: { type: String, trim: true },
  location: { type: String, trim: true },
  about: { type: String, trim: true },
  gender: { type: String, trim: true },
  github: { type: String, trim: true },
  twitter: { type: String, trim: true },
  facebook: { type: String, trim: true },
  link: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  codepen: { type: String, trim: true },
  signupKey: { key: String, ts: String, exp: String },
  passwordResetKey: { key: String, ts: String, exp: String },
  validated: { type: Boolean, default: false },
  languages: [String],
  certs: [String],
  skills: [String],
  time_zone: { type: String, trim: true },
  likedPosts: [String],
  contactMeta: {
    unSubbed: { type: Boolean, default: false },
    alreadyContacted: { type: Boolean, default: false }
  },
  engagementMeta: {
    addPostReminder: { type: Date },
    addProfileReminder: { type: Date }
  },
  hash: String,
  salt: String
},
{
  timestamps: true
})

userSchema.plugin(passportLocalMongoose)

// plug in instance methods

userSchema.plugin(methods.hashPassword)
userSchema.plugin(methods.validatePassword)
userSchema.plugin(methods.generateJwt)

// plug in static class methods

userSchema.plugin(statics.findAllUsers)
userSchema.plugin(statics.findUserById)
userSchema.plugin(statics.updateUser)
userSchema.plugin(statics.deleteUser)

// exports

exports = module.exports = mongoose.model('User', userSchema)
