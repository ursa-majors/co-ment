'use strict'

exports = module.exports = (obj, rex) => {
  // if (typeof obj !== 'object') throw new Error('Invalid or missing `object` param')
  if (!(obj instanceof Object)) throw new Error('Invalid or missing `object` param')
  if (!(rex instanceof RegExp)) throw new Error('Invalid or missing `rex` param')

  const property = Object.entries(obj).find(([key]) => key.match(rex))
  return property && property[1]
}
