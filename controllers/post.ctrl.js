'use strict'

const Post = require('../models/post')
const User = require('../models/user')
const { errorWithStatus } = require('../utils')

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
async function getPosts (req, res, next) {
  // request only active, non-deleted posts
  const query = {
    active: true,
    deleted: false
  }

  // iterate over req params, conditionally adding params to the query
  for (let key in req.query) {
    if (key === 'id') {
      query._id = req.query.id
    } else if (key === 'active' && req.query.active === 'all') {
      delete query.active
    } else {
      query[key] = req.query[key]
    }
  }

  try {
    const posts = await Post.findPosts({ query })
    return res.status(200).json(posts)
  } catch (err) {
    return next(err)
  }
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
async function createPost (req, res, next) {
  const { title, role } = req.body
  if (!title) return res.status(400).json({ message: 'Missing required title' })
  if (!role) return res.status(400).json({ message: 'Missing required role' })

  try {
    const target = { author: req.token._id, role, title, deleted: false }
    const existingPost = await Post.findOne(target).exec()

    // Error if non-deleted post w/ same author_id, role & title found
    if (existingPost) {
      throw errorWithStatus(new Error('same/similar post already exists'), 400)
    }

    const now = new Date().toISOString()

    // create new post
    const newPost = new Post({
      author: req.token._id,
      role: req.body.role,
      title: req.body.title,
      body: req.body.body,
      excerpt: req.body.excerpt,
      keywords: req.body.keywords,
      availability: req.body.availability,
      createdAt: now,
      updatedAt: now
    })

    // save new post to database
    await newPost.save()

    // hydrate author info
    const post = await newPost.populate({
      path: 'author',
      select: 'username name avatarUrl time_zone languages gender'
    })

    return res.status(200).json({ message: 'New post saved!', post })
  } catch (err) {
    return next(err)
  }
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
async function updatePost (req, res, next) {
  const target = { _id: req.params.id, author: req.token._id }
  const updates = { ...req.body, updatedAt: new Date().toISOString() }
  const options = { new: true }

  try {
    const updatedPost = await Post.updatePost({ target, updates, options })
    if (!updatedPost) throw errorWithStatus(new Error('Post not found!'), 404)

    // hydrate post with author info
    const post = await updatedPost.populate({
      path: 'author',
      select: 'username name avatarUrl time_zone languages gender'
    })

    return res.status(200).json({ message: 'Post updated', post })
  } catch (err) {
    return next(err)
  }
}

// DELETE A POST
//   Example: DELETE >> /api/posts/597dd8665229970e99c6ab55
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//     2) post 'id' from request params
//   Returns: success message & deleted post on success
async function deletePost (req, res, next) {
  const target = { _id: req.params.id, author: req.token._id }

  try {
    const deletedPost = await Post.deletePost({ target })
    if (!deletedPost) {
      throw errorWithStatus(new Error('Post not found'), 404)
    }

    // hydrate post with author info
    const post = await deletedPost.populate({
      path: 'author',
      select: 'username name avatarUrl time_zone languages gender'
    })

    return res.status(200).json({ message: 'Post deleted!', post })
  } catch (err) {
    return next(err)
  }
}

// INCREMENT A POST'S VIEW COUNT
//   Example: PUT >> /api/posts/597dd8665229970e99c6ab55/viewsplusplus
//   Secured: yes, valid JWT required
//   Expects:
//     1) post 'id' from request params
//     2) user '_id' from JWT
//   Returns: success status only
async function incPostViews (req, res, next) {
  // match only if post author NOT EQUAL to requesting user
  const target = {
    _id: req.params.id,
    author: { $ne: req.token._id }
  }

  try {
    await Post.incrementViews({ target })
    return res.status(200).end()
  } catch (err) {
    return next(err)
  }
}

// INCREMENT / DECREMENT A POST'S LIKE COUNT
//   Example: PUT >> /api/posts/597dd8665229970e99c6ab55/likes?action=plusplus
//   Secured: yes, valid JWT required
//   Expects:
//     1) post 'id' from request params
//     2) user '_id' from JWT
//     3) action from request query param (either 'plusplus' or 'minusminus')
//   Returns: success status only
async function updatePostLikes (req, res, next) {
  const postId = req.params.id
  const userId = req.token._id
  const action = req.query.action

  try {
    const [user, post] = await Promise.all([
      User.findUserById({ userId }),
      Post.findById(postId).exec()
    ])

    // do nothing when trying to like an already liked post
    if (action === 'plusplus' && user.likedPosts.includes(postId)) {
      return res.end()
    }

    // do nothing when trying to unlike a post the user doesn't already like
    if (action === 'minusminus' && !user.likedPosts.includes(postId)) {
      return res.end()
    }

    // do nothing if author is trying to like their own post
    if (post.author === userId) {
      return res.end()
    }

    // update user's likedPosts array
    if (action === 'plusplus' && !user.likedPosts.includes(postId)) {
      user.likedPosts.push(postId)
    } else if (action === 'minusminus' && user.likedPosts.includes(postId)) {
      user.likedPosts = user.likedPosts.filter(p => p !== postId)
    }

    // update post's likes counter
    if (action === 'plusplus') {
      post.meta.likes += 1
    } else if (action === 'minusminus') {
      post.meta.likes -= 1
    }

    // save user and post
    await user.save()
    await post.save()

    return res.status(200).end()
  } catch (err) {
    return next(err)
  }
}

/* ============================== EXPORT API =============================== */

module.exports = {
  getPosts, createPost, updatePost, deletePost, incPostViews, updatePostLikes
}
