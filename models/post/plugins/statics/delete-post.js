'use strict'

/**
 * Deletes a post by updating it to inactive
 * @param  {Object}  target  Consisting of post _id & author
 */
function deletePost ({ target }) {
  if (target == null) throw new Error('Missing required target param')
  const updates = {
    deleted: true,
    active: false,
    updatedAt: new Date().toISOString()
  }
  const options = { new: true }
  return this.findOneAndUpdate(target, updates, options).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.deletePost = deletePost
}
