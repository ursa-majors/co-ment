'use strict'

function findOneWithParticipants ({ conversationId }) {
  if (!conversationId) throw new Error('Missing required conversationId')

  return this.find({ _id: conversationId })
    .limit(1)
    .select('subject startDate messages participants')
    .populate({
      path: 'participants',
      select: 'username name avatarUrl'
    })
    .exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findOneWithParticipants = findOneWithParticipants
}
