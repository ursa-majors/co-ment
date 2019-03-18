'use strict'

function incrementViews ({ target }) {
  if (target == null) throw new Error('Missing required target param')

  const updates = { $inc: { 'meta.views': 1 } }
  return this.findOneAndUpdate(target, updates).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.incrementViews = incrementViews
}
