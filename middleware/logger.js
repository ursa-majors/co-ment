'use strict'

const bunyan = require('bunyan')
const uuidV4 = require('uuid/v4')
const { maskAuthHeader } = require('../utils')

exports = module.exports = () => (req, res, next) => {
  req.log = bunyan.createLogger({
    name: 'co/ment API',
    requestId: uuidV4(),
    serializers: {
      req: _reqSerializer,
      res: _resSerializer,
      err: bunyan.stdSerializers.err
    }
  })
  next()
}

// custom serializers

function _reqSerializer (req) {
  return {
    method: req.method,
    url: req.url,
    headers: maskAuthHeader(req.headers)
  }
}

function _resSerializer (res) {
  if (!res || !res.statusCode) return res
  return {
    statusCode: res.statusCode,
    headers: maskAuthHeader(res.getHeaders())
  }
}
