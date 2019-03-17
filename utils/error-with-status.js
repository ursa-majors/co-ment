'use strict'

exports = module.exports = (err, status = 500) => {
  err.status = status
  return err
}
