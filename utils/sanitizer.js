/* utils/sanitizer.js

   Strips nefarious BS from a string

   Credit:
   https://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side

*/

const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*'
const tagOrComment = new RegExp(
  '<(?:' +
    // Comment body.
    '!--(?:(?:-*[^->])*--+|-?)' +
    // Special "raw text" elements whose content should be elided.
    '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*' +
    '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*' +
    // Regular name
    '|/?[a-z]' + tagBody + ')>',
  'gi')

function removeTags (html) {
  let oldHtml
  do {
    oldHtml = html
    html = html.replace(tagOrComment, '')
  } while (html !== oldHtml)
  return html.replace(/</g, '&lt;')
}

module.exports = (text) => {
  return removeTags(text)
}
