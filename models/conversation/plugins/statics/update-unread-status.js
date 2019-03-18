'use strict'

function updateUnreadStatus ({ target, status }) {
  const updates = { '$set': { 'unread': status } }
  const options = { new: true }

  return this.findOneAndUpdate(target, updates, options).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.updateUnreadStatus = updateUnreadStatus
}
