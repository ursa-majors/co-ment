'use strict'

function findAllWithParticipants ({ userId }) {
  if (!userId) throw new Error('Missing required userId')

  const filter = { participants: userId }

  return this.find(filter)
    .select('subject startDate messages participants')
    .populate({
      path: 'participants',
      select: 'username name avatarUrl'
    })
    .exec()
}

exports = module.exports = function (schema, options) {
  schema.statics.findAllWithParticipants = findAllWithParticipants
}
