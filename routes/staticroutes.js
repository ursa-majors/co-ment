/*
   non-secured routes to serve static client front-end files
*/

/* ================================= SETUP ================================= */

const router = require('express').Router();
const path   = require('path');

/* =========================== INIT CONTROLLERS ============================ */

const staticCtrl = require('../controllers/static.ctrl');


/* ================================ ROUTES ================================= */

// Catch client-side routes that don't exist on the back-end.
// Redirects to /#/redirect={route}/{optional_id}
router.get('/:client_route/:uid?', staticCtrl.redirectHash);


// Serve client frontend.
router.get('/', staticCtrl.serveClient);


/* ================================ EXPORT ================================= */

module.exports = router;
