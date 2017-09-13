/*
   secured routes to handle database queries
*/

/* ================================= SETUP ================================= */

const router = require('express').Router();
const secret = process.env.JWT_SECRET;
const jwt    = require('express-jwt');
const auth   = jwt({ secret: secret, requestProperty: 'token' });


/* ========================= INIT ROUTE MIDDLEWARE ========================= */

// Checks existence and validity of JWT token
router.use(auth);


// Checks wheather user has validated their account.
// If `validated: false`, bail out early.
function checkValidated(req, res, next) {
    
    const validatedErrMsg = 'You need to validate your account before you can access this resource. Please visit your Profile and generate a new validation email.';
    
    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    } else {
        next();
    }
    
}


/* =========================== INIT CONTROLLERS ============================ */

const profileCtrl    = require('../controllers/profile.ctrl');
const postCtrl       = require('../controllers/post.ctrl');
const contactCtrl    = require('../controllers/contact.ctrl');
const connectionCtrl = require('../controllers/connection.ctrl');


/* ================================ ROUTES ================================= */


// Get a user's profile
// Returns JSON user profile object on success
router.get('/api/profile/:id', profileCtrl.getOneProfile);


// Update a user's profile.
// Returns updated JSON user profile object on success.
router.put('/api/profile/:id', profileCtrl.updateProfile);


// Delete a user and all their posts
// Returns deleted user profile
router.delete('/api/profile/:id', profileCtrl.deleteProfile);


// Get posts
// Returns JSON array of 'post' objects on success.
router.get('/api/posts', postCtrl.getPosts);


// Increment Post views
// Returns success status code; returns no data
router.put('/api/posts/:id/viewsplusplus', postCtrl.incPostViews);


// Resend user validation email
// Returns success message
router.get('/api/resendvalidation', contactCtrl.resendValidation);


// ===== INIT MIDDLEWARE FOR FOLLOWING ROUTES =====
router.use(checkValidated);


// Get all user profiles
// Returns an array of user profile objects
router.get('/api/profiles', profileCtrl.getProfiles);


// Create a post
// Returns new post object
router.post('/api/posts', postCtrl.createPost);


// Update a post
// Returns updated post object
router.put('/api/posts/:id', postCtrl.updatePost);


// Increment or decrement a post's likes
// Returns sucess status code only
router.put('/api/posts/:id/likes', postCtrl.updatePostLikes);


// Delete a post
// Returns deleted post object
router.delete('/api/posts/:id', postCtrl.deletePost);


// Send contact email to another user
// Returns success message
router.post('/api/sendemail', contactCtrl.sendEmail);


// Get all connections where the user is either a mentor or mentee
// Returns success message
router.get('/api/connections', connectionCtrl.getConnections);


// Create a new connection record
// Returns success message on success.
router.post('/api/connections', connectionCtrl.createConnection);


// Update a connection record's status & status date
// Returns success message on success.
router.put('/api/connections', connectionCtrl.updateConnection);


/* ================================ EXPORT ================================= */

module.exports = router;
