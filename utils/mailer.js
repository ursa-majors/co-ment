/* utils/mailer.js

   Service to dispatch emails from our API
   
*/

const dotenv        = require('dotenv').config();
const nodeMailer    = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');


/** create nodemailer transporter
*/
const transporter   = nodeMailer.createTransport(smtpTransport({
    secure   : true,
    service  : 'Gmail',
    auth     : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
}));


/** send email message
 * 
 * @params    [string]   to        [recipient's address]
 * @params    [string]   subject   [mail subject]
 * @params    [string]   body      [mail message body]
*/
function mailer(to, subject, body) {
    
    const mailObj = {
        from    : `co/ment ${process.env.EMAIL_USER}`,
        to      : to,
        subject : subject,
    };
    
    if (body.type === 'text') {
        mailObj.text = body.text;
    } else if (body.type === 'html') {
        mailObj.html = body.text;
    }
    
    transporter.sendMail(mailObj, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

module.exports = mailer;
