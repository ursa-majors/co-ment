'use strict'

function deleteUser ({ target }) {
  if (target == null) throw new Error('Missing required target param')
  return this.findOneAndRemove(target).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.deleteUser = deleteUser
}
