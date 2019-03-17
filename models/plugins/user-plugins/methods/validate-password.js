'use strict'

const crypto = require('crypto')

// hash and compare submitted passwords to stored hashes in db.
// return 'true' if match
function validatePassword (pwd) {
  const hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

exports = module.exports = function (schema, options) {
  schema.methods.validatePassword = validatePassword
}
