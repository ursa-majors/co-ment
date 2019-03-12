'use strict'

/**
 * Sanitizes authorization values in headers
 * @param    {Object}  headers  Original request headers
 * @returns  {Object}
 */
exports = module.exports = function (headers) {
  return Object.keys(headers).reduce(_sanitizeAuthHeaders, {
    source: headers, target: {}
  }).target
}

/**
 * Recursively masks authorization values
 * @param    {Object}  acc
 * @param    {String}  key
 * @returns  {Object}
 * @private
 */
function _sanitizeAuthHeaders (acc, key) {
  let value = acc.source[key]

  if (value && typeof value === 'object') {
    value = Object.keys(value).reduce(_sanitizeAuthHeaders, {
      source: value,
      target: {}
    }).target
  } else if (typeof value === 'string') {
    value = /^authorization$/i.test(key)
      ? '<MASKED>'
      : value
  }
  acc.target[key] = value
  return acc
}
