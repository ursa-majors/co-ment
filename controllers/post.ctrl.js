/* ================================= SETUP ================================= */

const User = require('../models/user');
const Post = require('../models/post');


/* ============================ ROUTE HANDLERS ============================= */

// GET POSTS
//   Example: GET >> /api/posts?role=mentor&id=12345689
//   Secured: yes, valid JWT required
//   Query params for filtering requests:
//     role        Return only 'mentor' or 'mentee' wanted posts
//     id          Return single specific post object '_id'
//     author_id   Return only posts by a specific author
//   Returns JSON array of 'post' objects on success.
//
function getPosts(req, res) {
    
    const query = {
        active  : true,
        deleted : false
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


// NEW POST
//   Example: POST >> /api/posts
//   Secured: yes, valid JWT required
//   Expects:
//     1) 'author_id' from JWT token
//     2) request body properties : {
//          author        : String
//          author_id     : String
//          author_name   : String
//          author_avatar : String
//          role          : String
//          title         : String
//          body          : String
//          keywords      : Array
//          availability  : String
//        }
//   Returns new post object on success.
//
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
//   Example: PUT >> /api/posts/597dd8665229970e99c6ab55
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT token
//     2) request body properties : {
//          action        : Boolean
//          author        : String
//          author_id     : String
//          author_name   : String
//          author_avatar : String
//          role          : String
//          title         : String
//          body          : String
//          keywords      : Array
//          availability  : String
//        }
//   Returns updated post on success.
//
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
//   Example: DELETE > /api/posts/597dd8665229970e99c6ab55
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT token
//     2) 'id' from request params
//   Returns deleted post on success.
//
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

module.exports = { getPosts, createPost, updatePost, deletePost };
