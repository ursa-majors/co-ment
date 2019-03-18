'use strict'

exports = module.exports = Object.freeze({
  findPosts: require('./find-posts'),
  updatePost: require('./update-post'),
  incrementViews: require('./increment-post-views'),
  deletePost: require('./delete-post'),
  deletePostsByAuthor: require('./delete-posts-by-author')
})
