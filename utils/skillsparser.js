/* Skills parsing utility module

   (c) 2017 Whobot team - Jay Schwane and Peter Martinson
   https://github.com/belcurv/whobot

*/

const skills = require('./skillsdictionary')
const dictionary = flattenDictionary(skills)

/* =============================== utilities =============================== */

/* flattens the 2d skills dictionary
 *
 * @params   [object]   dict    [the 2d skills object]
 * @returns  [object]           [flattned & re-keyed skills map]
*/
function flattenDictionary (dict) {
  const result_obj = {}
  const dict_keys = Object.keys(dict)
  dict_keys.forEach(k => {
    dict[k].forEach(skill => {
      result_obj[skill] = k
    })
  })
  return result_obj
}

/* ============================ public methods ============================= */

/* return a standard skill if it exists
 * otherwise return the argument
 *
 * @params   [string]   request    [skill name]
 * @returns  [string]              [standard or original skill]
*/
function parseSKill (request) {
  let matchSkill = request
  if (dictionary.hasOwnProperty(request.toLowerCase())) {
    matchSkill = dictionary[request.toLowerCase()]
  }
  return matchSkill
}

/* ================================ exports ================================ */

module.exports = parseSKill
