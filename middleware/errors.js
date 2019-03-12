'use strict'

const { STATUS_CODES } = require('http')

exports = module.exports = () => (err, req, res, next) => {
  const status = err.status || 500
  let statusMessage = err.message || STATUS_CODES[status]
  req.log.error({ req, res, err }, `${status} ${statusMessage}`)
  res.status(status).json({ message: err.message })
  next()
}
