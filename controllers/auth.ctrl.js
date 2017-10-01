/*
   functions to handle user signup, login and password reset
*/

/* ================================= SETUP ================================= */

const passport  = require('passport');
const mailer    = require('../utils/mailer');
const emailTpl  = require('../utils/mailtemplates');
const mailUtils = require('../utils/mailutils');
const User      = require('../models/user');


/* =============================== UTILITIES =============================== */


/* Dispatch new user validation email
 *
 * @ params   [object]   params
 * @ params   [string]    * key      [randomly generated key]
 * @ params   [string]    * to_email [user/recipient email address]
 * @ params   [string]    * to_uid   [new user's _id ]
*/
function sendValidationEmail(params) {

    const url     = mailUtils.makeValidationUrl(params.to_uid, params.key);
    const subject = 'co/ment - Email verification required';
    const body    = {
        type: 'html',
        text: emailTpl.validationTemplate(url, params.to_uid)
    };

    // send mail using `mailer` util
    try {
        mailer(params.to_email, subject, body);
        console.log('Email validation sent successfully.');
    } catch (err) {
        console.log(`Error: $(err)`);
    }

}


/* Dispatch new password reset email
 *
 * @ params   [object]   params
 * @ params   [string]    * key      [randomly generated key]
 * @ params   [string]    * to_email [user/recipient email address]
 * @ params   [string]    * recUsesrId [user/recipient _id]
*/
function sendPWResetEmail(params) {
    console.log('pwreset', params);
    const url     = `https://co-ment.glitch.me/resetpassword/${params.key}`;
    const subject = 'co/ment - Password Reset Request';
    const body    = {
        type: 'html',
        text: emailTpl.pwResetTemplate(url, params.recUserId)
    };

    // send mail using `mailer` util
    try {
        mailer(params.to_email, subject, body);
        console.log('Email validation sent successfully.');
    } catch (err) {
        console.log(`Error: $(err)`);
    }

}


/* ============================ ROUTE HANDLERS ============================= */

// NEW_USER REGISTRATION
// Dispatches new user validation email
//   Example: POST >> /api/register
//   Secured: no
//   Expects:
//     1) request body properties : {
//          username : String
//          password : String
//          email    : String
//        }
//   Returns: user profile object & JWT on success
//
function register(req, res) {

    // fail if missing required inputs
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res
            .status(400)
            .json({ 'message': 'Please complete all required fields.' });
    }

   const target = {
        $or: [{ username: req.body.username }, { email: req.body.email }]
    };

    User.findOne(target)
        .exec()
        .then( user => {

            // finding a user is bad - reject --> catch block
            if (user && user.username === req.body.username) {
                return Promise.reject('Username already taken.');
            } else if (user && user.email === req.body.email) {
                return Promise.reject('Email already registered.');
            } else {
                return undefined;
            }

        })
        .then( () => {

            // no user found, let's build a new one
            const newUser = new User();

            newUser.username   = req.body.username;
            newUser.email      = req.body.email;
            newUser.validated  = false;
            newUser.signupKey  = mailUtils.makeSignupKey();
            newUser.hashPassword(req.body.password);

            return newUser;
        })
        .then( newUser => {

            // save new user to database
            newUser.save( (err, savedUser ) => {
                if (err) { throw err; }

                // build filtered user profile for later response
                const profile = {
                    username  : savedUser.username,
                    email     : savedUser.email,
                    validated : savedUser.validated,
                    _id       : savedUser._id
                };

                // build email parameter map
                const emailParams = {
                    key      : savedUser.signupKey.key,
                    to_email : savedUser.email,
                    to_uid   : savedUser._id
                };

                // send validation email, passing email param map
                sendValidationEmail(emailParams);

                // generate auth token
                const token = savedUser.generateJWT();

                // respond with profile & JWT
                return res
                    .status(200)
                    .json({
                        'profile' : profile,
                        'token'   : token
                    });

            });
        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });

}


// HANDLE EMAIL VALIDATION LINKS
// Toggles user's `validated` property to `true`
//   Example: GET >> /api/validate
//   Secured: no
//   Expects:
//     1) request query params
//        * uid : String
//        * key : String
//   Returns: redirect to client-side validation landing page
//
function validate(req, res) {

    const user_id  = req.query.uid;
    const test_key = req.query.key;

    const target = {
        _id : user_id
    };

    const updates = {
        validated: true
    };

    User.findOneAndUpdate(target, updates)
        .exec()
        .then( user => {

        if (!user) {

            return res
                .status(404)
                .json({ message: 'No user with that ID found.' });

        } else if (user.signupKey.key !== test_key) {

            return res
                .status(400)
                .json({ message: 'Registration key mismatch.' });

        } else {

            // build hash fragment for client-side routing
            const hash = '#/redirect=validate';
            return res
                // redirect to client-side validation landing page
                .redirect(302, `/${hash}`);

        }
    })
    .catch( err => {
        console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
    });

}


// LOGIN
//   Example: POST >> /api/login
//   Secured: no
//   Expects:
//     1) request body params : {
//          username : String
//          password : String
//        }
//   Returns: success status, user profile & JWT on success
//
function login(req, res, next) {

    // fail if missing required inputs
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ 'message': 'Please complete all required fields.'});
    }

    passport.authenticate('local', (err, user, info) => {

        if (err) { return next(err); }

        // if auth failed, there will be no user - fail
        if (!user) {
            return res
                .status(401)
                .json(info);

        } else {

            // exclude sensitive info from field selection
            const proj  = { hash : 0, salt : 0, signupKey : 0 };

            // find the authenticated user
            User.findById(user._id, proj)
                .exec()
                .then( (profile) => {

                    // generate a token
                    const token = profile.generateJWT();

                    // return the user profile & JWT
                    return res
                        .status(200)
                        .json({
                            'profile' : profile,
                            'token'   : token
                        });

                })
                .catch( err => {
                    console.log('Error!!!', err);
                        return res
                            .status(400)
                            .json({ message: err});
                });

        }

    })(req, res, next);

}


// SEND PW RESET EMAIL
// Dispatches password reset email
//   Example: POST >> /api/sendresetemail
//   Secured: no
//   Expects:
//     1) request body params : {
//          username : String
//        }
//   Returns: success status & message on success
//
function sendReset(req, res) {

    // generate reset key
    const resetKey = mailUtils.makeSignupKey();

    // find user by username
    User.findOne({ username: req.body.username })
        .exec()
        .then(user => {

            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'No user with that username' });
            }

            //store key on user
            user.passwordResetKey = resetKey;

            user.save((err, user) => {

                if (err) { throw err; }

                // build email parameter map
                const emailParams = {
                    key         : user.passwordResetKey.key,
                    to_email    : user.email,
                    recUserId   : user._id
                };

                // send validation email, passing email param map
                sendPWResetEmail(emailParams);

                return res
                    .status(200)
                    .json( {message: 'Password Reset email sent!'});
            });

        })
        .catch( err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });
}


// RESET PASSWORD
//   Example: POST >> /api/resetpassword
//   Secured: no
//   Expects:
//     1) request body params : {
//          username : String
//          password : String
//          key      : String
//        }
//   Returns: success status & message on success
//
function resetPass(req, res) {

    const target = { username: req.body.username };

    User.findOne(target)
        .exec()
        .then(user => {

            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'No user with that username' });
            }

            if (user.passwordResetKey.key !== req.body.key) {
                return res
                    .status(400)
                    .json({ message: 'Invalid password reset key' });
            }

            // reset password, clear the key, save the user
            user.hashPassword(req.body.password);
            user.passwordResetKey = {};
            user.save( (err, user) => {

                if (err) { throw err; }

                return res
                    .status(200)
                    .json({ message: 'Password reset successful' });
            });

        })
        .catch(err => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
        });
}


/* ============================== EXPORT API =============================== */

module.exports = { register, validate, login, sendReset, resetPass };
