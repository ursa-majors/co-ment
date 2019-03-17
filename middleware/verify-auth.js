const jwt = require('express-jwt')
const secret = process.env.JWT_SECRET

exports = module.exports = jwt({ secret: secret, requestProperty: 'token' })
