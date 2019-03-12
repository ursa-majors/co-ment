/*
   functions to handle sending contact & validation email
*/

/* ================================= SETUP ================================= */

const User = require('../models/user')
const sanitize = require('../utils/sanitizer')
const mailer = require('../utils/mailer')
const emailTpl = require('../utils/mailtemplates')
const { makeSignupKey, makeValidationUrl, makeBoilerplate } = require('../utils/mailutils')

/* ============================ ROUTE HANDLERS ============================= */

// SEND EMAIL
//   Example: POST >> /api/sendemail
//   Secured: yes, valid JWT required
//   Expects:
//     1) sender's username' from JWT token
//     2) request body properties : {
//          recipient    : String (username)
//          sender       : String (username)
//          copySender   : Boolean
//          subject      : String
//          body         : String
//          type         : String
//          connectionId : String
//        }
//   Returns: success message on success
//
function sendEmail (req, res) {
  // prohibit users from contacing themselves
  if (req.token.username === req.body.recipient) {
    return res
      .status(400)
      .json({ message: 'You cannot contact yourself!' })
  }

  const toUser = { username: req.body.recipient }
  const fromUser = { username: req.body.sender }

  // find the target recipient
  User.findOne(toUser)
    .exec()
    .then(recipient => {
      if (!recipient) {
        throw new Error('User not found!')
      }

      // find the sender (we need their email address)
      User.findOne(fromUser, (err, sender) => {
        if (err) { throw err }

        const recipientList = req.body.copySender ? `${recipient.email};${sender.email}` : recipient.email

        const greeting = req.body.copySender ? `${recipient.username} and ${sender.username}` : recipient.username

        const boilerplate = makeBoilerplate(req.body.type, sender, recipient)

        const params = {
          to: recipientList,
          subject: req.body.subject,
          body: {
            type: 'html',
            text: emailTpl.contactTemplate(
              greeting, // toUser
              sender.username, // fromUser
              sender.email, // fromEmail
              sanitize(req.body.body), // bodyText
              req.body.connectionId, // connectionId
              boilerplate.boilerplate, // boilerplate
              boilerplate.recUserId // recUserId
            )
          }
        }

        // send mail using `mailer` util
        try {
          mailer(params.to, params.subject, params.body)
          return res
            .status(200)
            .json({ message: 'Message sent successfully.' })
        } catch (err) {
          console.log(`Error: ${err}`)
          return res
            .status(400)
            .json({ message: 'Error: Message not sent.' })
        }
      })
    })
    .catch((err) => {
      return res
        .status(404)
        .json({ message: err.toString() })
    })
}

// RESEND VALIDATION EMAIL
//   Example: GET >> /api/resendvalidation
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT token
//   Returns: success message on success
//
function resendValidation (req, res) {
  const target = { _id: req.token._id }
  const updates = { signupKey: makeSignupKey() }
  const options = { new: true }

  User.findOneAndUpdate(target, updates, options)
    .exec()
    .then(user => {
      const url = makeValidationUrl(user._id, user.signupKey.key)
      const subject = 'co/ment - Email verification required'
      const body = {
        type: 'html',
        text: emailTpl.validationTemplate(url, user._id)
      }

      // send mail using `mailer` util
      try {
        mailer(user.email, subject, body)
        return res
          .status(200)
          .json({ message: 'Email validation sent successfully.' })
      } catch (err) {
        console.log(`Error: $(err)`)
      }
    })
    .catch(err => {
      console.log('Error!!!', err)
      return res
        .status(400)
        .json({ message: err })
    })
}

/* ============================== EXPORT API =============================== */

module.exports = { sendEmail, resendValidation }
