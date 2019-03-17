'use strict'

const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

// Generate and return signed JWT based on 'this' user object
function generateJWT () {
  const payload = {
    _id: this._id,
    username: this.username,
    validated: this.validated
  }
  const options = {
    expiresIn: '7d'
  }

  return jwt.sign(payload, jwtSecret, options)
}

exports = module.exports = function (schema, options) {
  schema.methods.generateJWT = generateJWT
}
