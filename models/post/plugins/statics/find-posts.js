'use strict'

function findPosts ({ query }) {
  return this.find(query)
    .populate('author', 'username name avatarUrl time_zone languages gender')
    .exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findPosts = findPosts
}
