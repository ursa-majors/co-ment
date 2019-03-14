'use strict'

const { findObjProperty } = require('../utils')

// match: 'x-forwarded-proto' | 'X-Forwarded-Protocol'
const regex = /^x-forwarded-proto(col)?$/i

exports = module.exports = (isProd) => (req, res, next) => {
  if (isProd) {
    let xForwardedProto = findObjProperty(req.headers, regex)
    if (xForwardedProto.match(/https/g)) {
      // Secure protocol, continue as normal
      return next()
    }
    res.redirect(302, `https://${req.hostname}${req.url}`)
  } else {
    return next()
  }
}
