'use strict'

const crypto = require('crypto')

function hashPassword (pwd) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex')
}

exports = module.exports = function (schema, options) {
  schema.methods.hashPassword = hashPassword
}
