/*
   secured routes to handle database queries
*/

/* ================================= SETUP ================================= */

const router = require('express').Router();
const secret = process.env.JWT_SECRET;
const jwt    = require('express-jwt');
const auth   = jwt({ secret: secret, requestProperty: 'token' });


/* ========================= INIT ROUTE MIDDLEWARE ========================= */

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

const profileCtrl      = require('../controllers/profile.ctrl');
const postCtrl         = require('../controllers/post.ctrl');
const contactCtrl      = require('../controllers/contact.ctrl');
const connectionCtrl   = require('../controllers/connection.ctrl');
const conversationCtrl = require('../controllers/conversation.ctrl');


/* ================================ ROUTES ================================= */


// Get a user's profile
// Returns JSON user profile object on success
router.get('/api/profile/:id', [auth], profileCtrl.getOneProfile);


// Update a user's profile.
// Returns updated JSON user profile object on success.
router.put('/api/profile/:id', [auth], profileCtrl.updateProfile);


// Delete a user and all their posts
// Returns deleted user profile
router.delete('/api/profile/:id', [auth], profileCtrl.deleteProfile);


// Get posts
// Returns JSON array of 'post' objects on success.
router.get('/api/posts', [auth], postCtrl.getPosts);


// Increment Post views
// Returns success status code; returns no data
router.put('/api/posts/:id/viewsplusplus', [auth], postCtrl.incPostViews);


// Resend user validation email
// Returns success message
router.get('/api/resendvalidation', [auth], contactCtrl.resendValidation);


// Get all user profiles
// Returns an array of user profile objects
router.get('/api/profiles', [auth, checkValidated], profileCtrl.getProfiles);


// Create a post
// Returns new post object
router.post('/api/posts', [auth, checkValidated], postCtrl.createPost);


// Update a post
// Returns updated post object
router.put('/api/posts/:id', [auth, checkValidated], postCtrl.updatePost);


// Increment or decrement a post's likes
// Returns sucess status code only
router.put('/api/posts/:id/likes', [auth, checkValidated], postCtrl.updatePostLikes);


// Delete a post
// Returns deleted post object
router.delete('/api/posts/:id', [auth, checkValidated], postCtrl.deletePost);


// Send contact email to another user
// Returns success message
router.post('/api/sendemail', [auth, checkValidated], contactCtrl.sendEmail);


// Get all connections where the user is either a mentor or mentee
// Returns success message
router.get('/api/connections', [auth, checkValidated], connectionCtrl.getConnections);


// Create a new connection record
// Returns success message on success.
router.post('/api/connections', [auth, checkValidated], connectionCtrl.createConnection);


// Update a connection record's status & status date
// Returns success message on success.
router.put('/api/connections', [auth, checkValidated], connectionCtrl.updateConnection);


// Get a list of a user's conversations
// Returns array of conversations on success
router.get('/api/conversations', [auth, checkValidated], conversationCtrl.getConversations);


// Get all messages in one of the user's conversation
// Returns array of messages on success
router.get('/api/conversations/:id', [auth, checkValidated], conversationCtrl.getConversation);


// Create a new conversation
// Returns success message & conversation '_id' on success.
router.post('/api/conversations', [auth, checkValidated], conversationCtrl.createConversation);


// Create a new message
// Returns success message on success.
router.post('/api/messages', [auth, checkValidated], conversationCtrl.postMessage);


/* ================================ EXPORT ================================= */

module.exports = router;
