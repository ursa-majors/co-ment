/* ================================= SETUP ================================= */

const path   = require('path');


/* ============================ PUBLIC METHODS ============================= */


// REDIRECT HASH
// Purpose: catch client-side routes that don't exist on the back-end.
// Parameterizes the URL and redirects to root `/` route + hash fragment
// consisting of the client route parameters.
// For ex. /viewpost/59992bbc3dd8a2007161fc37
// Is redirected to: /#/redirect=viewpost/59992bbc3dd8a2007161fc37
// Client picks off the hash fragment and executes the route.
function redirectHash(req, res) {
  
    // keep only keys with `truthy` values (not undefined)
    const params_keys = Object.keys(req.params).filter( el => req.params[el] );
    
    let hash_string = '#/redirect=';
  
    // build hash from request parameters
    params_keys.forEach( (key, index) => {
      
        // only prepend with slash if the key is not the first key
        if (index !== 0) { hash_string += '/'; }
        // append the request parameter
        hash_string += `${req.params[key]}`;
        
    });
  
    // send the redirect
    res.redirect(302, `/${hash_string}`);
}


// SERVE CLIENT
function serveClient(req, res) {
    res.status(200)
        .sendFile(path.join(__dirname, '../client/build/index.html'));
}


/* ============================== EXPORT API =============================== */

module.exports = {
    redirectHash : redirectHash,
    serveClient  : serveClient
};
