/* ================================= SETUP ================================= */

const User   = require('../models/user');
const mailer = require('../utils/mailer');


/* ============================ PUBLIC METHODS ============================= */

// SEND EMAIL
function sendEmail(req, res) {

    // prohibit users from contacing themselves
    if (req.token._id === req.params.id) {
        return res
            .status(400)
            .json({ message : 'You cannot contact yourself!'});
    }

    const target = req.params.id;
    const sender = req.token._id;

    // find the target recipient
    User.findOne({_id: target})
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
            User.findOne({_id: sender}, (err, sender) => {

                if (err) { throw err; }

                // what do we want to include in the message? Hmm ...
                const bodyText = req.body.bodyText;

                const from_user  = sender.username;
                const from_email = sender.email;
                const to         = recipient.email;
                const subject    = `co/ment - Contact Request from ${from_user}`;
                const body       = `Contact Request from ${from_user} (${from_email}).\n\n${bodyText}`;

                // send mail using `mailer` util
                try {
                    mailer(to, subject, body);
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


/* ============================== EXPORT API =============================== */

module.exports = {
  sendEmail : sendEmail
};
