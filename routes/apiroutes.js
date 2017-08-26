/* secured routes to handle database queries

   ========================== Route Descriptions ==============================
   VERB      URL                       DESCRIPTION
   ----------------------------------------------------------------------------
   GET       /api/profiles             Get all profiles
   GET       /api/profile/:id          Get a user's profile
   PUT       /api/profile/:id          Update user's own profile
   DELETE    /api/profile/:id          Delete user's own profile

   GET       /api/posts                Get all posts
   GET       /api/posts?role=          Get all mentor OR mentee posts
   GET       /api/posts?id=            Get single post

   POST      /api/posts                Create new post
   PUT       /api/posts/:id            Update single post
   DELETE    /api/posts/:id            Delete single post

   POST      /api/contact/:user_id     Contact a mentor/mentee

   POST      /api/connect              Create a mentor/mentee connection
   GET       /api/connections          Get all user's own connections
   POST      /api/updateconnection     Update a connection's status & date
*/

/* ================================= SETUP ================================= */

const routes     = require('express').Router();
const User       = require('../models/user');
const Post       = require('../models/post');
const Connection = require('../models/connection');
const jwt        = require('express-jwt');
const request    = require('request');
const parseSKill = require('../utils/skillsparser');
const mailer     = require('../utils/mailer');
const sanitize   = require('../utils/sanitizer');
const secret     = process.env.JWT_SECRET;
const auth       = jwt({ secret: secret, requestProperty: 'token' });

const user_projection = {
    _id       : 1, updatedAt : 1, createdAt  : 1, email     : 1,
    username  : 1, name      : 1, ghUserName : 1, ghProfile : 1,
    time_zone : 1, skills    : 1, languages  : 1, validated : 1,
    avatarUrl : 1, location  : 1, about      : 1, certs     : 1,
    gender    : 1, twitter   : 1, facebook   : 1, link      : 1,
    linkedin  : 1, codepen   : 1
};

const validatedErrMsg = 'You need to validate your account before you can access this resource. Check your inbox for a validation email.';

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

/* Get all user profiles. Secured route - valid JWT required.
   Returns an array of user profile objects on success.
   Example: GET > `/api/profiles`
*/
routes.get('/api/profiles', auth, (req, res) => {

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    const target = req.params.id;

    User.find({}, user_projection, (err, profiles) => {

        if (!profiles) {
            return res
                .status(404)
                .json({ message : 'No profiles found!'});
        }

        return res
            .status(200)
            .json(profiles);

    });

});


/* Get a user's profile. Secured route - valid JWT required
   Returns JSON user profile object on success.
   Example: GET > `/api/profile/597dccac7017890bd8d13cc7`
*/
routes.get('/api/profile/:id', auth, (req, res) => {
    
    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    const target = req.params.id;

    User.findOne({_id: target}, user_projection, (err, profile) => {

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

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

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
    .then( () => {

        const options = {
            new: true  // return updated document rather than the original
        };

        const updates = {
            ghUserName : req.body.ghUserName,
            name       : req.body.name,
            avatarUrl  : req.body.avatarUrl,
            location   : req.body.location,
            languages  : req.body.languages,
            gender     : req.body.gender,
            about      : req.body.about,
            skills     : (req.body.skills).map( skill => parseSKill(skill) ),
            time_zone  : req.body.time_zone,
            twitter    : req.body.twitter,
            facebook   : req.body.facebook,
            link       : req.body.link,
            linkedin   : req.body.linkedin,
            codepen    : req.body.codepen,
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


/* Delete a user and all their posts.
   Secured route - valid JWT required
   Returns deleted user profile on success.
   Example: DELETE > /api/profile/597e3dca8167330add4be737
*/
routes.delete('/api/profile/:id', auth, (req, res) => {

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    const targetUser = {
        _id      : req.params.id,
        username : req.token.username
    };

    // make sure the requesting user ID and target user ID match
    if (targetUser._id !== req.token._id) {
        return res
            .status(400)
            .json({ message: 'Error: user ID mismatch.'});
    }
    
    User.findOneAndRemove(targetUser)
        .exec()
        .then( user => {

            if (!user) {

                return res
                    .status(404)
                    .json({message: 'User not found!'});

            } else {
                
                const postAuthor = {
                    author_id : targetUser._id,
                    author    : targetUser.username
                };
                
                const updates = {
                    deleted   : true,
                    active    : false
                };
                
                const options = {
                    multi     : true
                };
                
                // "delete" all posts from same author. Sets "deleted" to true,
                // and "active" to false
                Post.update(postAuthor, updates, options, (err, raw) => {
                    
                    if (err) { throw err; }
                    
                    else {
                        console.log('The raw response from Mongo was ', raw);
                        
                        return res
                            .status(200)
                            .json({
                                message : 'User profile deleted!',
                                post    : user
                            });
                    }                    
                    
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
routes.get('/api/posts*', auth, (req, res) => {
    
    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    const query = {
        active  : true,  // find only active posts
        deleted : false  // find only non-deleted posts
    };

    // check for 'id' query param & add to 'query' map
    if (req.query.hasOwnProperty('id')) {
        query._id = req.query.id;
    }

    // check for 'role', accept only 'mentor' or 'mentee' values
    if (req.query.hasOwnProperty('role') &&
       (req.query.role === 'mentor' || req.query.role === 'mentee')) {

        query.role = req.query.role;
    }

   // check for 'author_id' & add to query map
    if (req.query.hasOwnProperty('author_id')) {
        query.author_id = req.query.author_id;
    }

    console.log(query);

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

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    // Check if exists non-deleted post with same author_id, role & title
    Post
        .findOne({
            author_id : req.token._id,
            role      : req.body.role,
            title     : req.body.title,
            deleted   : false
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
                myPost.author           = req.body.author;
                myPost.author_id        = req.token._id;
                myPost.author_name      = req.body.author_name;
                myPost.author_avatar    = req.body.author_avatar;
                myPost.role             = req.body.role;
                myPost.title            = req.body.title;
                myPost.body             = req.body.body;
                myPost.keywords         = req.body.keywords;
                myPost.availability     = req.body.availability;

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

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    // target post by post '_id' and post 'author_id'.
    // this way, users can only update their own posts.
    const target = {
        _id       : req.params.id,
        author_id : req.token._id
    };

    
    // build new post object from request body and parsed token
    const updates = {
        active          : req.body.active,
        author          : req.body.author,
        author_id       : req.token._id,
        author_name     : req.body.author_name,
        author_avatar   : req.body.author_avatar,
        role            : req.body.role,
        title           : req.body.title,
        body            : req.body.body,
        keywords        : req.body.keywords,
        availability    : req.body.availability
    };
    
    console.log(updates);

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

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    // target post by post '_id' and post 'author_id'.
    // this way, users can only delete their own posts.
    const target = {
        _id       : req.params.id,
        author_id : req.token._id
    };
    
    const updates = {
        deleted : true,
        active  : false
    };

    // findOneAndUpdate(conditions, update, callback) 
    Post.findOneAndUpdate(target, updates, (err, post) => {
        
        if (err) { throw err; }
        
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


/* Send email contact message to another user by _id.
   Secured route - valid JWT required
   Returns success message on success.
   Example: POST > /api/contact/597dd8665229970e99c6ab55
*/
routes.post('/api/contact/:id', auth, (req, res) => {

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    // prohibit users from contacing themselves
    if (req.token._id === req.params.id) {
        return res
            .status(400)
            .json({ message : 'You cannot contact yourself!'});
    }

    const target = req.params.id;
    const sender = req.token._id;

    // find the target recipient
    User.findOne({_id: target})
        .exec()
        .then(recipient => {

            if (!recipient) {
                return res
                    .status(404)
                    .json({ message : 'User not found!'});
            } else {
                return recipient;
            }
        })
        .then(recipient => {

            // find the sender (we need their email address)
            User.findOne({_id: sender}, (err, sender) => {

                if (err) { throw err; }

                // clean post body using `sanitizer` util
                const bodyText   = sanitize(req.body.bodyText);
                const from_user  = sender.username;
                const from_email = sender.email;
                const to         = recipient.email;
                const subject    = `co/ment - Contact Request from ${from_user}`;
                const body       = {
                    type : 'html',
                    text : `
                        <div style="background: #0e76bc; background-image: linear-gradient(#0e76bc, #5cbeaf); padding: 0 2em 5em;">
                            <h1 style="text-align: center; padding: .5em; color: white; font-family: sans-serif; font-weight:100; letter-spacing: .08em; text-shadow: 0 0 20px rgba(0, 0, 0, 0.63);">co/ment</h1>
                            <p style="color: white; font-size: 1.1em; font-family: sans-serif;">Contact Request from <strong>${from_user}</strong> (<a href="mailto:${from_email}" style="color: #fff500;">${from_email}</a>).</p>
                            <p style="color: white; font-size: 1.1em; font-family: sans-serif;">${bodyText}</p>
                        </div>`
                };

                // send mail using `mailer` util
                try {
                    mailer(to, subject, body);
                    return res
                        .status(200)
                        .json({ message : 'Message sent successfully.'});
                } catch (err) {
                    console.log(`Error: $(err)`);
                    return res
                        .status(400)
                        .json({ message : 'Error: Message not sent.'});
                }



            });

        });


});


/* Get all connections where the user is either a mentor or mentee
   Secured route - valid JWT required
   Expects the user's _id from the JWT token
   Returns success message on success.
   Example: GET > /api/connections
*/
routes.get('/api/connections', auth, (req, res) => {

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    const target = req.token._id;
    
    Connection.find({
        $or: [
            { "mentor.id": target },
            { "mentee.id": target }
        ]})
        .exec()
        .then( (conns) => {
            return res
                .status(200)
                .json({ connections: conns });
        })
        .catch( (error) => {
            console.log(`Error: $(error)`);
            return res
                .status(400)
                .json({ message : 'Error: Cannot get connections' });
        
    });
    
});


/* Create a connection record in mongoDB
   Secured route - valid JWT required
   Expects post body:
   {
     mentor     : id,
     mentee     : id,
     mentorName : string,
     menteeName : string,
     initiator  : id,
     status     : 'pending'
   }
   Returns success message on success.
   Example: POST > /api/connect
*/
routes.post('/api/connect', auth, (req, res) => {

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    let newConn = new Connection(req.body);
    
    newConn.dateStarted = Date.now();
    
    newConn
        .save( (err, conn) => {
            if (err) { throw err; }

            return res
                .status(200)
                .json({ message: "Connection created" });

        })
        .catch( (err) => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
        });
    
});


/* Update a connection record's status & status date
   Secured route - valid JWT required
   Expects post body:
   {
     id   : id,
     type : String
   }
   Returns success message on success.
   Example: POST > /api/updateconnection
*/
routes.post('/api/updateconnection', auth, (req, res) => {

    if (!req.token.validated) {
        return res
            .status(400)  // bad request
            .json({ message : validatedErrMsg });
    }

    const target = {
        _id: req.body.id
    };

    let update;

    switch (req.body.type) {

        case 'ACCEPT':
            update = {
                status: 'accepted',
                dateAccepted: Date.now(),
            };
            break;

        case 'DECLINE':
            update = {
                status: 'declined',
                dateDeclined: Date.now(),
            };
            break;

        case 'EXPIRE':
            update = {
                status: 'expired',
                dateExpired: Date.now(),
            };
            break;

        default:
            update = {};

    }

    const options = {
        new: true  // return updated document rather than original
    };

    Connection.findOneAndUpdate(target, update, options)
        .exec()
        .then( (conn) => {
            return res
                .status(200)
                .json({ conn });
        })
        .catch( (err) => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
        });
});


/* ================================ EXPORT ================================= */

module.exports = routes;
