/*
   functions to handle sending contact & validation email
*/

/* ================================= SETUP ================================= */

const User      = require('../models/user');
const sanitize  = require('../utils/sanitizer');
const mailer    = require('../utils/mailer');
const mailUtils = require('../utils/mailutils');
const emailTpl  = require('../utils/mailtemplates');


/* ============================ ROUTE HANDLERS ============================= */

// SEND EMAIL
//   Example: POST >> /api/contact/597dd8665229970e99c6ab55
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT token
//     2) 'id' from request params
//   Returns: success message on success
//
function sendEmail(req, res) {

    // prohibit users from contacing themselves
    if (req.token._id === req.params.id) {
        return res
            .status(400)
            .json({ message : 'You cannot contact yourself!'});
    }

    const target = { _id: req.params.id };
    const fromId = { _id: req.token._id };

    // find the target recipient
    User.findOne(target)
        .exec()
        .then(recipient => {

            if (!recipient) {
                return res
                    .status(404)
                    .json({ message : 'User not found!'});
            } else {
                return recipient;
            }
        })
        .then(recipient => {

            // find the sender (we need their email address)
            User.findOne(fromId, (err, sender) => {

                if (err) { throw err; }
                             
                const params = {
                    to      : recipient.email,
                    subject : `co/ment - Contact Request from ${sender.username}`,
                    body    : {
                        type : 'html',
                        text : emailTpl.contactTemplate(
                                recipient.username,          // toUser
                                sender.username,             // fromUser
                                sender.email,                // fromEmail
                                sanitize(req.body.bodyText), // bodyText
                                req.body.connectionId        // connectionId
                               )
                    }
                };
                
                // send mail using `mailer` util
                try {
                    mailer(params.to, params.subject, params.body);
                    return res
                        .status(200)
                        .json({ message : 'Message sent successfully.'});
                } catch (err) {
                    console.log(`Error: $(err)`);
                    return res
                        .status(400)
                        .json({ message : 'Error: Message not sent.'});
                }

            });

        });
}


// RESEND VALIDATION EMAIL
//   Example: GET >> /api/resendvalidation
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT token
//   Returns: success message on success
//
function resendValidation(req, res) {
    
    const target  = { _id : req.token._id };
    const updates = { signupKey : mailUtils.makeSignupKey() };
    const options = { new : true };
    
    User.findOneAndUpdate(target, updates, options)
        .exec()
        .then( user => {

            const url = mailUtils.makeValidationUrl(user._id, user.signupKey.key);
            const subject = 'co/ment - Email verification required';
            const body    = {
                type: 'html',
                text: emailTpl.validationTemplate(url)
            };
        
            // send mail using `mailer` util
            try {
                mailer(user.email, subject, body);
                return res
                    .status(200)
                    .json({ message: 'Email validation sent successfully.' });
            } catch (err) {
                console.log(`Error: $(err)`);
            }

        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });
    
}


/* ============================== EXPORT API =============================== */

module.exports = { sendEmail, resendValidation };
