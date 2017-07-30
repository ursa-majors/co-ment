/* secured routes to handle database queries
   
   ========================== Route Descriptions ==============================
   VERB      URL                       DESCRIPTION                        DONE
   ----------------------------------------------------------------------------
   GET       /api/profile/:id          Get a user's profile                Y
   PUT       /api/profile/:id          Update user's own profile
   DELETE    /api/profile/:id          Delete user's own profile
   
   GET       /api/posts                Get all posts                       Y
   GET       /api/posts?role=          Get all mentor OR mentee posts      Y
   GET       /api/posts?id=            Get single post                     Y
   
   POST      /api/posts                Create new post                     Y
   PUT       /api/posts/:id            Update single post                  Y
   DELETE    /api/posts/:id            Delete single post

*/

/* ================================= SETUP ================================= */

const routes   = require('express').Router();
const User     = require('../models/user');
const Post     = require('../models/post');
const jwt      = require('express-jwt');
const secret   = process.env.JWT_SECRET;
const auth     = jwt({ secret: secret, requestProperty: 'token' });


/* ================================ ROUTES ================================= */

/* Get a user's profile. Secured route - valid JWT required
   Returns JSON user profile object.
   Example: GET > `/api/profile/597dccac7017890bd8d13cc7`
*/
routes.get('/api/profile/:id', auth, (req, res) => {
    
    const target = req.params.id;
    
    User.findOne({_id: target}, (err, profile) => {
        
        if (!profile) {
            return res
                .status(404)
                .json({ message : 'User profile not found!'});
        }
        
        return res
            .status(200)
            .json(profile);
        
    });
    
});


/* Get posts. Secured route - valid JWT required
   Returns JSON array of 'post' objects.
   Query params for filtering requests:
     'role'   Return only 'mentor' or 'mentee' wanted posts
     'id'     Return single specific post object '_id'
   Example: GET > `/api/posts?role=mentor&id=12345689`
*/
routes.get('/api/posts', auth, (req, res) => {
    
    const query = {};
    
    // check for 'id' query param & add to 'query' map
    if (req.query.hasOwnProperty('id')) {
        query._id = req.query.id;
    }
    
    // check for 'role', accept only 'mentor' or 'mentee' values
    if (req.query.hasOwnProperty('role') &&
       (req.query.role === 'mentor' || req.query.role === 'mentee')) {
        
        query.role = req.query.role;
    }
    
    Post.find(query, (err, posts) => {
        
        if (!posts || !posts.length) {
            return res
                .status(404)
                .json({ message : 'No posts found!'});
        }
        
        return res
            .status(200)
            .json(posts);
        
    });
    
});


/* Create a new post. Secured route - valid JWT required
   Grabs 'author_id' from JWT token parsed by 'auth' middleware.
   Returns JSON acknowledgement.
   Example: POST > /api/posts
*/
routes.post('/api/posts', auth, (req, res) => {
    
    // build new post object from request body and token
    const inputPost = {
        author       : req.body.author,
        author_id    : req.token._id,
        role         : req.body.role,
        title        : req.body.title,
        body         : req.body.body,
        keywords     : req.body.keywords,
        availability : req.body.availability
    };
    
    // Check if post with same author_id, role & title already exists
    Post
        .findOne({
            author_id : req.token._id,
            role      : req.body.role,
            title     : req.body.title
        })
        .exec()
        .then( post => {
            
            if (post) {
                
                // post already exists, fail
                return res
                    .status(400)
                    .json({ message: 'Error - same/similar post already exists!'});
                
            } else {
                
                // save new post to database
                Post.create(inputPost, (err, newPost) => {
                    return res
                        .status(200)
                        .json({
                            message : 'New post saved!',
                            post    : newPost
                        });
                });
                
            }
        
        })
        .catch( err => console.log('Error!!!', err));
    
});


/* Update a post. Secured route - valid JWT required
   Returns JSON acknowledgement.
   Example: PUT /api/posts/597dd8665229970e99c6ab55
*/
routes.put('/api/posts/:id', auth, (req, res) => {
    
    // target post by post '_id' and post 'author_id'.
    // this way, users can only update their own posts.
    const target = {
        _id       : req.params.id,
        author_id : req.token._id
    };
    
    // build new post object from request body and parsed token
    const updates = {
        author       : req.body.author,
        author_id    : req.token._id,
        role         : req.body.role,
        title        : req.body.title,
        body         : req.body.body,
        keywords     : req.body.keywords,
        availability : req.body.availability
    };
    
    const options = {
        // 'new' returns the updated document rather than the original
        new: true
    };
    
    Post.findOneAndUpdate(target, updates, options)
        .exec()
        .then( post => {
        
            if (!post) {
                
                return res
                    .status(404)
                    .json({message: 'Post not found!'});
                
            } else {
                
                return res
                    .status(200)
                    .json({
                        message : 'Post updated!',
                        post    : post
                    });

            }
    })
    .catch( err => console.log('Error!!!', err));
    
});


/* Update a post. Secured route - valid JWT required
   Returns JSON acknowledgement.
   Example: DELETE > /api/posts/597dd8665229970e99c6ab55
*/
routes.delete('/api/posts/:id', auth, (req, res) => {
    
    // target post by post '_id' and post 'author_id'.
    // this way, users can only delete their own posts.
    const target = {
        _id       : req.params.id,
        author_id : req.token._id
    };
    
    Post.findOneAndRemove(target)
        .exec()
        .then( post => {
            
            if (!post) {
                
                return res
                    .status(404)
                    .json({message: 'Post not found!'});
                
            } else {
                
                return res
                    .status(200)
                    .json({
                        message : 'Post deleted!',
                        post    : post
                    });

            }
        
        });
    
});


/* ================================ EXPORT ================================= */

module.exports = routes;
