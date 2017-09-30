/*
   functions to handle post retrieval, creation, update, and deletion
*/

/* ================================= SETUP ================================= */

const Post = require('../models/post');
const User = require('../models/user');


/* ============================ ROUTE HANDLERS ============================= */

// GET POSTS
//   Example: GET >> /api/posts?role=mentor&id=12345689
//   Secured: yes, valid JWT required
//   Query params for filtering requests:
//     role         Return only 'mentor' or 'mentee' wanted posts
//     id           Return single specific post object '_id'
//     author       Return only posts by a specific author
//     active=all   Return all posts, active and inactive
//   Returns: JSON array of 'post' objects on success.
//
function getPosts(req, res) {

    // request only active, non-deleted posts
    const query = {
        active  : true,
        deleted : false
    };

    // iterate over req params, adding any params to the query
    Object.keys(req.query).forEach( key => {
        if (key === 'id') {
            query._id = req.query.id;
        } else if (key === 'active' && req.query.active === 'all') {
            delete query.active;
        } else {
            query[key] = req.query[key];
        }
    });

    Post.find(query)
        .populate('author', 'username name avatarUrl time_zone languages gender')
        .exec()
        .then( posts => res.status(200).json(posts) )
        .catch( err => {
            return res
                .status(400)
                .json({ message: err });
        });
}


// CREATE NEW POST
//   Example: POST >> /api/posts
//   Secured: yes, valid JWT required
//   Expects:
//     1) author '_id' from JWT token
//     2) request body properties : {
//          role                : String
//          title               : String
//          body                : String
//          excerpt             : String
//          keywords            : Array
//          availability        : String
//        }
//   Returns: success message & new post object on success
//
function createPost(req, res) {

    // Check if exists non-deleted post with same author_id, role & title
    Post
        .findOne({
            author  : req.token._id,
            role    : req.body.role,
            title   : req.body.title,
            deleted : false
        })
        .exec()
        .then( post => {

            if (post) {

                // post already exists, fail
                return res
                    .status(400)
                    .json({ message: 'Error - same/similar post already exists!'});

            } else {
                
                // get a datestamp
                const now = new Date().toISOString();

                // create new post
                const myPost = new Post();

                // build new post from request body and token
                myPost.author           = req.token._id;
                myPost.role             = req.body.role;
                myPost.title            = req.body.title;
                myPost.body             = req.body.body;
                myPost.excerpt          = req.body.excerpt;
                myPost.keywords         = req.body.keywords;
                myPost.availability     = req.body.availability;
                myPost.createdAt        = now;
                myPost.updatedAt        = now;

                // save new post to database
                myPost.save( (err, newPost) => {
                    if (err) { throw new Error(err); }

                    newPost
                        .populate({
                            path   : 'author',
                            select : 'username name avatarUrl time_zone languages gender'
                        }, (err, populatedPost) => {

                            if (err) { throw new Error(err); }

                            return res
                                .status(200)
                                .json({
                                    message : 'New post saved!',
                                    post    : populatedPost
                                });
                        });
                });

            }

        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
        });

}


// UPDATE A POST
//   Example: PUT >> /api/posts/597dd8665229970e99c6ab55
//   Secured: yes, valid JWT required
//   Expects:
//     1) author '_id' from JWT token
//     2) request body properties : {
//          action              : Boolean
//          author              : String
//          role                : String
//          title               : String
//          body                : String
//          excerpt             : String
//          keywords            : Array
//          availability        : String
//        }
//   Returns: success message & updated post on success
//
function updatePost(req, res) {

    // Target post by post '_id' and 'author_id'.
    // This way, users can only update posts they authored.
    const target = {
        _id    : req.params.id,
        author : req.token._id
    };

    // build new post object from request body and parsed token
    const updates = {
        active       : req.body.active,
        author       : req.token._id,
        role         : req.body.role,
        title        : req.body.title,
        body         : req.body.body,
        excerpt      : req.body.excerpt,
        keywords     : req.body.keywords,
        availability : req.body.availability,
        updatedAt    : new Date().toISOString()
    };

    const options = { new: true };

    Post.findOneAndUpdate(target, updates, options)
        .exec()
        .then( post => {

            if (!post) {

                return res
                    .status(404)
                    .json({ message : 'Post not found!' });

            } else {

                post.populate({
                        path   : 'author',
                        select : 'username name avatarUrl time_zone languages gender'
                    }, (err, populatedPost) => {

                        if (err) { throw new Error(err); }

                        return res
                            .status(200)
                            .json({
                                message : 'Post updated!',
                                post    : populatedPost
                            });
                    });

            }
    })
    .catch( err => {
        console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
    });

}


// DELETE A POST
//   Example: DELETE >> /api/posts/597dd8665229970e99c6ab55
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//     2) post 'id' from request params
//   Returns: success message & deleted post on success
//
function deletePost(req, res) {

    // Target post by post '_id' and post 'author_id'.
    // This way, users can only delete their own posts.
    const target = {
        _id    : req.params.id,
        author : req.token._id
    };

    const updates = {
        deleted   : true,
        active    : false,
        updatedAt : new Date().toISOString()
    };
    
    const options = { new : true };

    Post.findOneAndUpdate(target, updates, options, (err, post) => {

        if (err) { throw err; }

        if (!post) {

            return res
                .status(404)
                .json({message: 'Post not found!'});

        } else {

            post.populate({
                    path   : 'author',
                    select : 'username name avatarUrl time_zone languages gender'
                }, (err, populatedPost) => {

                    if (err) { throw new Error(err); }

                    return res
                        .status(200)
                        .json({
                            message : 'Post deleted!',
                            post    : populatedPost
                        });
                });

        }

    });

}


// INCREMENT A POST'S VIEW COUNT
//   Example: PUT >> /api/posts/597dd8665229970e99c6ab55/viewsplusplus
//   Secured: yes, valid JWT required
//   Expects:
//     1) post 'id' from request params
//     2) user '_id' from JWT
//   Returns: success status only
//
function incPostViews(req, res) {

    const conditions = {

        // the post _id
        _id    : req.params.id,

        // match only if post author NOT EQUAL to requesting user
        author : { $ne: req.token._id }
    };

    const updates = { $inc: { 'meta.views': 1 } };

    Post.findOneAndUpdate(conditions, updates)
        .exec()
        .then( () => {
            return res.status(200).end();
        })
        .catch(err => {
            console.log(err);
            return res.status(400).end();
        });

}


// INCREMENT A POST'S LIKE COUNT
//   Example: PUT >> /api/posts/597dd8665229970e99c6ab55/likes?action=plusplus
//   Secured: yes, valid JWT required
//   Expects:
//     1) post 'id' from request params
//     2) user '_id' from JWT
//     3) action from request query param (either 'plusplus' or 'minusminus')
//   Returns: success status only
//
function updatePostLikes(req, res) {

    const postId = req.params.id;
    const userId = req.token._id;
    const action = req.query.action;

    User.findById(userId)
        .exec()
        .then( user => {

            const likedPosts = user.likedPosts;

            // fail on already liked post
            if (action === 'plusplus' && likedPosts.indexOf(postId) > -1) {
                return res.end();
            }

            // fail on unlike a post the user doesn't already like
            if (action === 'minusminus' && likedPosts.indexOf(postId) === -1) {
                return res.end();
            }

            // add/remove post _id from array depending on action
            if (action === 'plusplus' && likedPosts.indexOf(postId) === -1) {
                user.likedPosts.push(postId);
            } else if (action === 'minusminus' && likedPosts.indexOf(postId) > -1) {
                let postIdx = user.likedPosts.indexOf(postId);
                user.likedPosts.splice(postIdx, 1);
            }

            Post.findById(postId)
                .exec()
                .then( post => {

                    // fail if author tries to like their own post
                    if (post.author === userId) {
                        return res.end();
                    } else if (action === 'plusplus') {
                        post.meta.likes += 1;
                    } else if (action === 'minusminus') {
                        post.meta.likes -= 1;
                    }

                    // save user and post documents
                    user.save();
                    post.save();

                    // send success status and terminate
                    return res.status(200).end();

                });

        })
        .catch(err => {
            console.log(err);
            return res.status(400).end();
        });

}


/* ============================== EXPORT API =============================== */

module.exports = {
    getPosts, createPost, updatePost, deletePost, incPostViews, updatePostLikes
};
