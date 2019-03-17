'use strict'

function deletePostsByAuthor (authorId) {
  const updates = { deleted: true, active: false }
  const options = { multi: true }

  return this.update({ author_id: authorId }, updates, options).exec()
    .then(({ nModified }) => nModified > 0)
}

exports = module.exports = function (schema, options) {
  schema.statics.deletePostsByAuthor = deletePostsByAuthor
}
