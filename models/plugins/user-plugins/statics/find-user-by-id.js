'use strict'

function findUserById ({ userId, projection = {} }) {
  if (userId == null) throw new Error('Missing required userId param')
  return this.findById(userId, projection).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findUserById = findUserById
}
