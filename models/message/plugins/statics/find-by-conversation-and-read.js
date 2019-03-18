'use strict'

/**
 * Finds all messages for a conversation, toggling unread field to false
 * @param    {String}  conversationId  Target conversation ID
 * @returns  {Array}                   Of updated conversation objects
 */
function findByConversationAndRead ({ conversationId }) {
  if (!conversationId) throw new Error('Missing required conversationId')

  const updates = { '$set': { 'unread': false } }
  const options = { new: true }

  return this.update({ conversationId }, updates, options).exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findByConversationAndRead = findByConversationAndRead
}
