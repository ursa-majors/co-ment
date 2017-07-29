/* secured routes to handle database queries
   
   ========================== Route Descriptions ======================
   VERB      URL                       DESCRIPTION
   --------------------------------------------------------------------
   GET       /api/profile/:id          Get a user's profile
   PUT       /api/profile/:id          Update user's own profile
   DELETE    /api/profile/:id          Delete user's own profile
   
   GET       /api/posts                Get all posts
   GET       /api/posts?role=          Get all mentor OR mentee posts
   GET       /api/posts?id=            Get single post
   
   POST      /api/posts                Create new post
   PUT       /api/posts/:id            Update single post
   DELETE    /api/posts/:id            Delete single post

*/

/* ================================= SETUP ================================= */

const routes   = require('express').Router();
const User     = require('../models/user');
const Post     = require('../models/post');
//const jwt      = require('express-jwt');
//const secret   = process.env.JWT_SECRET;
//const auth     = jwt({ secret: secret, requestProperty: 'token' });


/* ================================ ROUTES ================================= */

/* Get a user's profile. Secured route - valid JWT required
   Returns JSON user profile object.
   Ex. `/api/profile/5g1d5d8e1g21g5d7dg`
*/
routes.get('/api/profile/:id', (req, res) => {
    
    const user_id = req.params.id;
    
    // return static dummy object for testing
    return res.status(200).json({
        user_id   : user_id,
        username  : 'Dummy',
        pref_lang : 'English',
        certs     : ['pHD', '12 months as a test dummy'],
        time_zone : 'UTC-6'
    });
    
});


/* Get all posts. Secured route - valid JWT required
   Returns JSON array of 'post' objects.
   Query params:
     'role'   Return only 'mentor' or 'mentee' wanted posts
     'id'     Return single specific post object '_id'
   Ex. `/api/posts?role=mentor&id=12345689`
*/
routes.get('/api/posts', (req, res) => {
    
    // accept only 'mentor' or 'mentee' param values
    const role = (req.query.role === 'mentor' || req.query.role === 'mentee') ?
          req.query.role : undefined;
    const id   = req.query.id;
    
    return res.status(200).json({
        role    : role,
        post_id : id
    });
    
});


/* Create a new post. Secured route - valid JWT required
   Returns JSON acknowledgement.
*/
routes.post('/api/posts', (req, res) => {
    
    const postBody = {
        author       : req.body.author,
        role         : req.body.role,
        title        : req.body.title,
        body         : req.body.body,
        keywords     : req.body.keywords,
        availability : req.body.availability,
    };
    
    return res.status(200).json({
        status : 'Post saved!',
        post   : postBody
    });
    
});


/* Update a post. Secured route - valid JWT required
   Returns JSON acknowledgement.
*/
routes.put('/api/posts/:id', (req, res) => {
    
    // if (user_id !== post_author_id) { fail early }
    
    const postBody = {
        author       : req.body.author,
        role         : req.body.role,
        title        : req.body.title,
        body         : req.body.body,
        keywords     : req.body.keywords,
        availability : req.body.availability,
    };
    
    return res.status(200).json({
        status : 'Post updated!',
        post   : postBody
    });
    
});


/* Update a post. Secured route - valid JWT required
   Returns JSON acknowledgement.
*/
routes.delete('/api/posts/:id', (req, res) => {
    
    // if (user_id !== post_author_id) { fail early }
    
    const postBody = {
        author       : req.body.author,
        role         : req.body.role,
        title        : req.body.title,
        body         : req.body.body,
        keywords     : req.body.keywords,
        availability : req.body.availability,
    };
    
    return res.status(200).json({
        status : 'Post deleted!',
        post   : postBody
    });
    
});


/* ================================ EXPORT ================================= */

module.exports = routes;
