'use strict'

function updateUser ({ target, updates, options = {} }) {
  if (target == null) throw new Error('Missing required target param')
  if (updates == null) throw new Error('Missing required updates param')
  return this.findOneAndUpdate(target, updates, options).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.updateUser = updateUser
}
