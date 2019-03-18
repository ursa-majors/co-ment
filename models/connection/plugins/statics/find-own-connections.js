'use strict'

/**
 * Get connections where the user is either the mentor or mentee
 * @param   {String}  target  User's user _id
 * @returns {Array}           Of connection objects
 */
function findOwnConnections ({ target }) {
  if (!target) throw new Error('Missing required target param')

  const filter = { $or: [{ 'mentor.id': target }, { 'mentee.id': target }] }
  return this.find(filter).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findOwnConnections = findOwnConnections
}
