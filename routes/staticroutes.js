/* non-secured routes to serve static client front-end files */

/* ================================= SETUP ================================= */

const routes = require('express').Router();
const path   = require('path');


/* ================================ ROUTES ================================= */

// single root '/' route to serve client frontend.
// Client handles frontend routing.
routes.get('/', (req, res) => {
    res.status(200)
        .sendFile(path.join(__dirname, '../client/build/index.html'));

});


/* ================================ EXPORT ================================= */

module.exports = routes;
