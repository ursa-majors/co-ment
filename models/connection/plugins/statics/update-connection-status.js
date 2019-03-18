'use strict'

/**
 * Derive updated status from action type
 * @param    {String}  type
 * @returns  {Object}
 * @private
 */
function _getStatusFromType (type) {
  switch (type) {
    case 'ACCEPT':
      return {
        status: 'accepted',
        dateAccepted: Date.now()
      }
    case 'DECLINE':
      return {
        status: 'declined',
        dateDeclined: Date.now()
      }
    case 'DEACTIVATE':
      return {
        status: 'inactive',
        dateExpired: Date.now()
      }
    default:
      return {}
  }
}

function updateConnectionStatus ({ target, type }) {
  if (!target) throw new Error('Missing required target')
  if (!type) throw new Error('Missing required type')

  const status = _getStatusFromType(type)
  const options = { new: true } // return updated document
  return this.findOneAndUpdate(target, status, options).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.updateConnectionStatus = updateConnectionStatus
}
