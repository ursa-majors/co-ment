/* non-secured routes to handle user signup and login

   ========================== Route Descriptions ======================
   VERB      URL                       DESCRIPTION
   --------------------------------------------------------------------
   POST      /api/register             Save new user, return JWT
   POST      /api/login                Authenticate user, return JWT
*/

/* ================================= SETUP ================================= */

const routes   = require('express').Router();
const User     = require('../models/user');
const passport = require('passport');


/* ================================ ROUTES ================================= */

/* Route to handle new user signup.
   Returns fail status + message -or- success status + JWT
*/
routes.post('/api/register', (req, res) => {

    // fail if missing required inputs
    if (!req.body.username || !req.body.password) {
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
            const user = new User();
            
            user.username   = req.body.username;
            user.hashPassword(req.body.password);
            
            user.save( err => {
                if (err) { throw err; }

                // generate and respond with JWT
                const token = user.generateJWT();
                return res
                    .status(200)
                    .json({ 'token' : token });

            });
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

        if (!user) {
            return res
                .status(401)
                .json(info);

        } else {

            // generate and respond with JWT
            const token = user.generateJWT();
            return res
                .status(200)
                .json({ 'token' : token });

        }

    })(req, res, next);

});


/* ================================ EXPORT ================================= */

module.exports = routes;
