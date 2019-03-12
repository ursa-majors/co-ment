/* utils/mailer.js

   Service to dispatch emails from our API

   Gmail OAuth2 help:
   https://stackoverflow.com/questions/45665349/trying-to-use-nodemailer-to-send-emails-using-gmail-and-am-receiving-the-error

   https://medium.com/@pandeysoni/nodemailer-service-in-node-js-using-smtp-and-xoauth2-7c638a39a37e

*/

const dotenv = require('dotenv').config()
const nodeMailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

/** create Gmail Oauth2 transporter
*/
const gmailTransporter = nodeMailer.createTransport({
  service: 'Gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GM_CLIENT_ID,
    clientSecret: process.env.GM_CLIENT_SECRET,
    refreshToken: process.env.GM_REFRESH_TOKEN,
    accessToken: process.env.GM_ACCESS_TOKEN
  }
})

/** send email message
 *
 * @params    [string]   to        [recipient's address]
 * @params    [string]   subject   [mail subject]
 * @params    [string]   body      [mail message body]
*/
function mailer (to, subject, body) {
  const mailObj = {
    from: `co/ment ${process.env.EMAIL_USER}`,
    to: to,
    subject: subject
  }

  if (body.type === 'text') {
    mailObj.text = body.text
  } else if (body.type === 'html') {
    mailObj.html = body.text
  }

  gmailTransporter.sendMail(mailObj, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Message sent: ' + info.response)
    }
  })
}

module.exports = mailer
