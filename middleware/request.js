'use strict'

const { STATUS_CODES } = require('http')

exports = module.exports = () => (req, res, next) => {
  req.log.info(`Received ${req.method.toUpperCase()} >> ${req.url}`)

  // on 'finish' events, log the response
  res.on('finish', () => {
    const statusMessage = STATUS_CODES[res.statusCode]
    const level = res.statusCode < 400 ? 'info' : 'error'
    req.log[level](`Resolved ${req.method.toUpperCase()} >> ${res.statusCode} ${statusMessage}`)
  })
  next()
}
