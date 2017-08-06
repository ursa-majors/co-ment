/* secured routes to handle database queries
   
   ========================== Route Descriptions ==============================
   VERB      URL                       DESCRIPTION
   ----------------------------------------------------------------------------
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

const routes     = require('express').Router();
const User       = require('../models/user');
const Post       = require('../models/post');
const jwt        = require('express-jwt');
const request    = require('request');
const parseSKill = require('../utils/skillsparser');
const secret     = process.env.JWT_SECRET;
const auth       = jwt({ secret: secret, requestProperty: 'token' });


/* ============================ UTILITY METHODS ============================ */

/** Get user's GitHub profile
    @params    [string]   ghUserName   [GitHub username from request object]
    @returns   [object]                [found GitHub profile, else undefined]
*/
function getGithubProfile(ghUserName) {
    
    if (!ghUserName) { ghUserName = ''; }
    
    const options = {
        url : 'https://api.github.com/users/' + ghUserName,
        headers : {
            'Accept'     : 'application/vnd.github.v3+json',
            'User-Agent' : 'request'
        }
    };

    return new Promise( (resolve, reject) => {

        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(JSON.parse(body));
            } else {
                resolve(undefined);
            }
        });                

    });
}


/* ================================ ROUTES ================================= */

/* Get a user's profile. Secured route - valid JWT required
   Returns JSON user profile object on success.
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


/* Update a user's profile. Secured route - valid JWT required
   Returns updated JSON user profile object on success.
   Example: PUT > `/api/profile/597dccac7017890bd8d13cc7`
*/
routes.put('/api/profile/:id', auth, (req, res) => {
    
    const target = {
        _id      : req.params.id,
        username : req.token.username
    };

    // kick off promise chain
    new Promise( (resolve, reject) => {

        // make sure the requesting user ID and target user ID match
        if (target._id === req.token._id) {
            resolve(target);
        } else {
            reject('Error: user ID mismatch.');
        }

    })
    .then( () => getGithubProfile(req.body.ghUserName) )
    .then( (ghProfile) => {

        const options = {
            new: true  // return updated document rather than the original
        };

        const updates = {
            ghUserName : req.body.ghUserName,
            ghProfile  : ghProfile,
            pref_lang  : req.body.pref_lang,
            certs      : (req.body.certs).map( skill => parseSKill(skill) ),
            time_zone  : req.body.time_zone
        };

        User.findOneAndUpdate(target, updates, options)
            .exec()
            .then( user => {

                if (!user) {

                    return res
                        .status(404)
                        .json({message: 'User not found!'});

                } else {

                    return res
                        .status(200)
                        .json({
                            message : 'User updated!',
                            user    : user
                        });

                }
        });
        
    })
    .catch( err => {
        console.log('Error!!!', err);
        return res
            .status(400)
            .json({ message: err});
    });

});


/* Delete a user. Secured route - valid JWT required
   Returns deleted user profile on success.
   Example: DELETE > /api/profile/597e3dca8167330add4be737
*/
routes.delete('/api/profile/:id', auth, (req, res) => {
    
    const target = {
        _id      : req.params.id,
        username : req.token.username
    };
    
    // make sure the requesting user ID and target user ID match
    if (target._id !== req.token._id) {
        return res
            .status(400)
            .json({ message: 'Error: user ID mismatch.'});
    }
    
    User.findOneAndRemove(target)
        .exec()
        .then( user => {
            
            if (!user) {
                
                return res
                    .status(404)
                    .json({message: 'User not found!'});
                
            } else {
                
                return res
                    .status(200)
                    .json({
                        message : 'User profile deleted!',
                        post    : user
                    });

            }
        
        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });
    
});


/* Get posts. Secured route - valid JWT required
   Returns JSON array of 'post' objects on success.
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
   Returns new post object on success.
   Example: POST > `/api/posts`
*/
routes.post('/api/posts', auth, (req, res) => {
        
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
                
                // create new post
                const myPost = new Post();
                
                // build new post from request body and token
                myPost.author       = req.body.author;
                myPost.author_id    = req.body.author_id;
                myPost.role         = req.body.role;
                myPost.title        = req.body.title;
                myPost.body         = req.body.body;
                myPost.keywords     = req.body.keywords;
                myPost.availability = req.body.availability;

                // save new post to database
                myPost.save( (err, newPost) => {
                    if (err) { throw err; }
                    
                    return res
                        .status(200)
                        .json({
                            message : 'New post saved!',
                            post    : newPost
                        });
                });

            }

        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });
    
});


/* Update a post. Secured route - valid JWT required
   Returns updated post on success.
   Example: PUT `/api/posts/597dd8665229970e99c6ab55`
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
        active       : req.body.active,
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
    .catch( err => {
        console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
    });

});


/* Delete a post. Secured route - valid JWT required
   Returns deleted post on success.
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

        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });

});


/* ================================ EXPORT ================================= */

module.exports = routes;
