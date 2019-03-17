/*
   functions to serve static client files and handle route redirection
*/

/* ================================= SETUP ================================= */

const path = require('path')

/* ============================ ROUTE HANDLERS ============================= */

// REDIRECT HASH
//   Purpose: catch client-side routes that don't exist on the back-end.
//   Parameterizes the URL and redirects to root `/` route + hash fragment
//   consisting of the client route parameters.
//   For ex. /viewpost/bc37599dd92b8a2007161fc3
//   Is redirected to: /#/redirect=viewpost/bc37599dd92b8a2007161fc3
//   Client picks off the hash fragment and executes the route.
//
function redirectHash (req, res) {
  // keep only keys with `truthy` values (not undefined)
  const paramsKeys = Object.keys(req.params).filter(el => req.params[el])

  let hashString = '#/redirect='

  // build hash from request parameters
  paramsKeys.forEach((key, index) => {
    // only prepend with slash if the key is not the first key
    if (index !== 0) { hashString += '/' }
    // append the request parameter
    hashString += `${req.params[key]}`
  })

  // send the redirect
  res.redirect(302, `/${hashString}`)
}

// SERVE CLIENT SPA
//
function serveClient (req, res) {
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'))
}

/* ============================== EXPORT API =============================== */

module.exports = { redirectHash, serveClient }
