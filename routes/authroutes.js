/* non-secured routes to handle user signup and login

   ========================== Route Descriptions ===========================
   VERB      URL               DESCRIPTION
   -------------------------------------------------------------------------
   POST      /api/register     Save new user, email validation, return JWT
   GET       /api/validate     Flip user model prop `validated` to true
   POST      /api/login        Authenticate user, return JWT
*/

/* ================================= SETUP ================================= */

const routes    = require('express').Router();
const passport  = require('passport');
const crypto    = require('crypto');
const mailer    = require('../utils/mailer');
const emailTpl  = require('../utils/mailtemplates');
const User      = require('../models/user');


/* =============================== UTILITIES =============================== */


/* Generate random signup key
 *
 * @params    [none]
 * @returns   [object]    [signup key]
*/
function makeSignupKey() {
    const buf     = crypto.randomBytes(24);
    const created = Date.now();

    return {
        key : buf.toString('hex'),
        ts  : created,            // created time (in millisecond)
        exp : created + 86400000  // expires in 1 day (86400000 ms)
    };
}


/* Generate registration email validation url w/custom key
 * Makes sure key is unique & saves to DB
 *
 * @params    [string]   user_id   [id of user to validate]
 * @params    [string]   key       [custom validation key]
 * @returns   [object]             [custom validation URL]
*/
function makeValidationUrl(user_id, key) {
    const baseUrl = 'https://co-ment.glitch.me/api/validate';

    return `${baseUrl}?uid=${user_id}&key=${key}`;

}


/* Dispatch new user validation email
 *
 * @ params   [object]   params      [map of the following params]
 * @ params   [string]    * key      [randomly generated key]
 * @ params   [string]    * to_email [user/recipient email address]
 * @ params   [string]    * to_uid   [new user's _id ]
*/
function sendValidationEmail(params) {

    const url     = makeValidationUrl(params.to_uid, params.key);
    const subject = 'co/ment - Email verification required';
    const body    = {
        type: 'html',
        text: emailTpl.validationTemplate(url)
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
 * @ params   [object]   params      [map of the following params]
 * @ params   [string]    * key      [randomly generated key]
 * @ params   [string]    * to_email [user/recipient email address]
*/
function sendPWResetEmail(params) {
    console.log('pwreset', params);
    const url     = `https://co-ment.glitch.me/resetpassword/${params.key}`;
    const subject = 'co/ment - Password Reset Request';
    const body    = {
        type: 'html',
        text: emailTpl.pwResetTemplate(url)
    };

    // send mail using `mailer` util
    try {
        mailer(params.to_email, subject, body);
        console.log('Email validation sent successfully.');
    } catch (err) {
        console.log(`Error: $(err)`);
    }

}


/* ================================ ROUTES ================================= */

/* Route to handle new user signup.
   Returns fail status + message -or- success status + JWT
*/
routes.post('/api/register', (req, res) => {

    // fail if missing required inputs
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res
            .status(400)
            .json({ 'message': 'Please complete all required fields.' });
    }

    User.findOne({ username: req.body.username})
        .exec()
        .then( user => {
            // finding a user is bad - reject --> catch block
            return user ? Promise.reject('Username already taken.') : undefined;
        })
        .then( () => {

            // no user found, let's build a new one
            const newUser = new User();

            newUser.username   = req.body.username;
            newUser.email      = req.body.email;
            newUser.validated  = false;
            newUser.signupKey  = makeSignupKey();
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

});


/* Route to toggle user's `validated` property to `true`.
   Returns ///
*/
routes.get('/api/validate', (req, res) => {

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
            const hash = '#/redirect=profile';
            // const id = user._id
            return res
                // status 302 = “Found"
                .redirect(302, `/${hash}`);  // you made it, go to validation page!

        }
    })
    .catch( err => {
        console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err});
    });

});


/* Route to handle user login.
   Returns fail status + info -or- success status + JWT
*/
routes.post('/api/login', (req, res, next) => {

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

});

routes.post('/api/sendresetemail', (req, res) => {
  //generate a reset key
  const resetKey = makeSignupKey();

  //look up user with user name
  User.findOne({username: req.body.username})
    .exec()
    .then(user => {

      if (!user) {
        return res
          .status(400)
          .json({ message: 'No user with that username' });
      }

      //store key in user
      user.passwordResetKey = resetKey;
      user.save((err, user) => {
        if (err) throw err;

        //generate an email that contains a link to /resetpassword and the key
        // build email parameter map
        const emailParams = {
          key      : user.passwordResetKey.key,
          to_email : user.email
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
});

/*
*  Route: /api/resetpassword
*  Purpose: Allows password reset, if front end passes a user id and key that match an email sent to
*  user.
*/
routes.post('/api/resetpassword', (req, res) => {
  User.findOne({username: req.body.username})
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(400)
          .json({ message: 'No user with that username' });
      }

      // compare key in this request to the key that was generated by
      // password reset email.
      if (user.passwordResetKey.key !== req.body.key) {
        return res
          .status(400)
          .json({ message: 'Invalid password reset key' });
      }

      // if they match, reset password and clear the key
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
});


/* ================================ EXPORT ================================= */

module.exports = routes;
