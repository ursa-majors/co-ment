/*
   non-secured routes to handle user signup and login
*/

/* ================================= SETUP ================================= */

const router = require('express').Router();


/* =========================== INIT CONTROLLERS ============================ */

const authCtrl = require('../controllers/auth.ctrl');


/* ================================ ROUTES ================================= */

// Register new users
// Dispatches new user validation email
// Returns fail status + message -or- success status + JWT
router.post('/register', authCtrl.register);


// Handle email validation links
// Toggle user's `validated` property to `true`.
// Redirects to /#/redirect=validate
router.get('/validate', authCtrl.validate);


// Handle user login
// Returns fail status + info -or- success status + JWT
router.post('/login', authCtrl.login);


// Handle requests for password reset
// Returns fail status + message -or- success status + message
router.post('/sendresetemail', authCtrl.sendReset);


// Handle password resets
// Returns fail status + message -or- success status + message
router.post('/resetpassword', authCtrl.resetPass);


/* ============================== EXPORT API =============================== */

module.exports = router;
