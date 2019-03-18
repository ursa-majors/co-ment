'use strict'

const Conversation = require('../models/conversation')
const Message = require('../models/message')
const User = require('../models/user')
const mailer = require('../utils/mailer')
const { unreadsReminder } = require('../utils/mailtemplates')

/* =============================== UTILITIES =============================== */

/**
 * Calculate number of unread messages where the user = 'recipient'
 * @param    {array}    messages  array of elements we want to filter
 * @param    {string}   userId    user's _id
 * @returns  {number}             number of unread messages
 */
function countUnreads (messages, userId) {
  return messages.filter(m => m.unread && m.recipient.toString() === userId).length
}

/**
 * Build 'getConversations' response object from conversations array
 * @param    {Array}   convs  array of conversation objects
 * @returns  {Object}         formatted response
*/
const addConversationMetadata = (user) => (convs) => {
  // count all messages
  const totalMessages = convs.reduce((sum, conv) => {
    return sum + conv.messages.length
  }, 0)

  // count user's unread messages over all conversations
  const totalUnreads = convs.reduce((sum, conv) => {
    return sum + countUnreads(conv.messages, user)
  }, 0)

  // remap conversations to include metadata
  const conversations = convs.map(c => ({
    _id: c._id,
    subject: c.subject,
    qtyMessages: c.messages.length,
    qtyUnreads: countUnreads(c.messages, user),
    startDate: c.startDate,
    participants: c.participants,
    latestMessage: c.messages[c.messages.length - 1]
  }))

  return { totalMessages, totalUnreads, conversations }
}

/**
 * Add array of messages to conversations. Happens when a user gets a
 * conversation. Like a "read" event, so we also set message 'unread' to false.
 * @param    {object}  convo   conversation object
 * @param    {string}  user    user's '_id'
 * @returns  {object}          conversation with its messages
 */
async function populateMessages (convo) {
  // get all messages for a conversation, updating their 'unread' status = false
  const messages = await Message.findByConversationAndRead({ conversationId: convo._id })

  return {
    _id: convo._id,
    subject: convo.subject,
    participants: convo.participants,
    startDate: convo.startDate,
    messages
  }
}

/**
 * Dispatch reminder email if user's alreadyContacted = false
 * @param    {String}   recipient  recipient's user _id
 * @returns  {Boolean}             True if recipient was emailed
 */
async function duckDuckSpam (recipient) {
  const projection = {
    username: 1,
    email: 1,
    'contactMeta.alreadyContacted': 1
  }

  try {
    const user = await User.findById(recipient, projection).exec()
    if (!user || user.contactMeta.alreadyContacted) return false

    sendReminderEmail({ to_name: user.username, to_email: user.email })

    // update user's `contactMeta.alreadyContacted` field
    user.contactMeta.alreadyContacted = true
    await user.save()
    return true
  } catch (err) {
    throw new Error(err)
  }
}

function sendReminderEmail (params) {
  const url = 'https://co-ment-dev.glitch.me/inbox'
  const subject = 'co/ment - New unread messages'
  const body = {
    type: 'html',
    text: unreadsReminder(url, params.to_name)
  }

  // send mail using `mailer` util
  try {
    mailer(params.to_email, subject, body)
    console.log(`emailing: ${params.to_email} unread messages reminder.`)
  } catch (err) {
    console.log(`Mailer error: $(err)`)
  }
}

/* ============================ ROUTE HANDLERS ============================= */

// GET ALL USERS CONVERSATIONS WITH MESSAGES & EXTRA METADATA
//   Example: GET >> /api/conversations
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//   Returns: array of user's conversations with most recent messages.
async function getConversations (req, res, next) {
  const userId = req.token._id
  try {
    const conversations = await Conversation.findAllWithParticipants({ userId })
      .then(populateMessages)
      .then(addConversationMetadata(userId))

    // set user's alreadyContacted flag to false so they rec
    // reminders of new messages
    const updates = { $set: { 'contactMeta.alreadyContacted': false } }
    await User.findByIdAndUpdate(userId, updates).exec()

    return res.status(200).json(conversations)
  } catch (err) {
    return next(err)
  }
}

// GET A CONVERSATION WITH MESSAGES
//   Example: GET >> /api/conversations/:id
//   Secured: yes, valid JWT required
//   Expects:
//     1) conversation '_id' from the request params
//   Returns: conversation object with nested array of messages
async function getConversation (req, res, next) {
  const conversationId = req.params.id
  try {
    const [conversation] = await Conversation.findOneWithParticipants({ conversationId })
      .then(populateMessages)
    res.status(200).json(conversation)
  } catch (err) {
    return next(err)
  }
}

// CREATE NEW CONVERSATION
//   Example: POST >> /api/conversations
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//     2) request body properties
//          recipientId : String
//          message     : String
//          subject     : String
//        }
//   Returns: success message on success
async function createConversation (req, res, next) {
  if (!req.body.recipientId) {
    return res.status(400).json({ message: 'Missing recipient ID.' })
  }

  if (!req.body.message) {
    return res.status(400).json({ message: 'Missing message.' })
  }

  if (!req.body.subject) {
    return res.status(400).json({ message: 'Missing subject.' })
  }

  const conversation = new Conversation({
    subject: req.body.subject,
    participants: [req.token._id, req.body.recipientId]
  })

  const message = new Message({
    conversation: conversation._id,
    body: req.body.message,
    author: req.token._id,
    recipient: req.body.recipientId,
    originatedFrom: 'connection'
  })

  conversation.messages.push(message._id)

  try {
    await message.save()
    await conversation.save()
    return res.status(200).json({ message: 'Conversation started!', conversation })
  } catch (err) {
    return next(err)
  }
}

// CREATE NEW MESSAGE
//   Example: POST >> /api/messages
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//     2) request body properties
//          recipientId  : String
//          conversation : String
//          messageBody  : String
//        }
//   Returns: new message object
//   Triggers check for & send 'unreads available' email to recipient
async function createMessage (req, res, next) {
  const message = new Message({
    conversation: req.body.conversation,
    body: req.body.messageBody,
    author: req.token._id,
    recipient: req.body.recipientId,
    originatedFrom: 'conversation'
  })

  try {
    await message.save()
    // call utility to check for and send unreads waiting email
    const didEmail = duckDuckSpam(message.recipient)
    req.log.info(`${didEmail ? 'Did' : 'Did not'} email ${message.recipient}`)

    return res.status(200).json({ message: message })
  } catch (err) {
    return next(err)
  }
}

/* ============================== EXPORT API =============================== */

module.exports = {
  getConversations,
  getConversation,
  createConversation,
  createMessage
}
