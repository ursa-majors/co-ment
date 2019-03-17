'use strict'

const skillsDictionary = require('./skillsdictionary')

/**
 * Flattens the 2D skills dictionary
 * @param    {Object}  dict  the 2d skills object
 * @returns  {Object}        flattned & re-keyed skills map
 * @private
 */
function _flattenDictionary (dict) {
  const resultObj = {}
  const dictKeys = Object.keys(dict)
  dictKeys.forEach(k => {
    dict[k].forEach(skill => {
      resultObj[skill] = k
    })
  })
  return resultObj
}

// main

const dictionary = _flattenDictionary(skillsDictionary)

/**
 * return a standard skill if it exists, otherwise return the argument
 * @param    {String}  request  skill name
 * @returns  {String}           standard or original skill
 */
function parseSkill (request) {
  let matchSkill = request
  if (dictionary.hasOwnProperty(request.toLowerCase())) {
    matchSkill = dictionary[request.toLowerCase()]
  }
  return matchSkill
}

// exports

exports = module.exports = parseSkill
