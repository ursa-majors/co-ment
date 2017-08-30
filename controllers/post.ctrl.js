/* ================================= SETUP ================================= */

const User = require('../models/user');
const Post = require('../models/post');

const user_projection = {
    signupKey : 0, passwordResetKey: 0, hash: 0, salt: 0
};


/* ============================ PUBLIC METHODS ============================= */

/* GET ALL POSTS
   Query params for filtering requests:
     'role'   Return only 'mentor' or 'mentee' wanted posts
     'id'     Return single specific post object '_id'
   Example: GET > `/api/posts?role=mentor&id=12345689`
*/
function getPosts(req, res) {
    
    const query = {
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

}

/* NEW POST
   Grabs 'author_id' from JWT token parsed by 'auth' middleware.
   Example: POST > `/api/posts`
*/
function createPost(req, res) {
        
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

}

// UPDATE A POST
function updatePost(req, res) {

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

}

// DELETE A POST
function deletePost(req, res) {

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

}


/* ============================== EXPORT API =============================== */

module.exports = {
  getPosts   : getPosts,
  createPost : createPost,
  updatePost : updatePost,
  deletePost : deletePost
};
