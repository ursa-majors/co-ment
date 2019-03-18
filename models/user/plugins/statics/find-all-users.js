'use strict'

function findAllUsers ({ projection = {} }) {
  return this.find({}, projection).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findAllUsers = findAllUsers
}
