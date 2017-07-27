/* jshint esversion:6, node: true */

/*
   non-secured routes to handle user signup and login
   
   POST >> /api/register  >> store user in db, return JWT, redirect home
   POST >> /api/login     >> return JWT, redirect home
   
*/

/* ================================= SETUP ================================= */

const routes   = require('express').Router();
const User     = require('../models/user');
const passport = require('passport');

/* ================================ ROUTES ================================= */


/* Route to handle new user signup.
   Returns fail status + message -or- success status + JWT
*/
routes.post('/api/signup', (req, res) => {
    
    // fail if missing required inputs
    if (!req.username || !req.password) {
        return res
            .status(400)
            .json({ 'message': 'Please complete all required fields.'});
    }
    
    // check if user already in database
    User.findOne({ username: req.body.username}, (err, user) => {
        
        if (err) { throw err; }
        
        // if user already in db, return error. Else create user
        if (user) {
            return res
                .status(400)
                .json({ 'message': 'Username already taken.'});
            
        } else {
            let user = new User();
            user.username = req.body.username;
            user.hashPassword(req.body.password);
            
            user.save( err => {
                if (err) { throw err; }
                
                // generate and respond with JWT
                const token = user.generateJWT();
                return res
                    .status(201)
                    .json({ 'token' : token });
                
            });
        }
    });
});


/* Route to handle user login.
   Returns fail status + info -or- success status + JWT
*/
routes.post('api/login', (req, res, next) => {
    
    // fail if missing required inputs
    if (!req.username || !req.password) {
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
