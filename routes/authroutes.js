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
const request  = require('request');
const passport = require('passport');


/* =============================== UTILITIES =============================== */

/** Get user's GitHub profile
    @params    [object]   req   [the express route's request object]
    @returns   [object]         [GitHub profile JSON if found, else undefined]
*/
function getGithubProfile(req) {

    const options = {
        url : `https://api.github.com/users/${req.body.github}`,
        headers : {
            'Accept'     : 'application/vnd.github.v3+json',
            'User-Agent' : 'request'
        }
    };

    return new Promise( (resolve, reject) => {

        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(JSON.parse(body));
            } else {
                resolve(undefined);
            }
        });                

    });
}


/** Check if user already exists
    If 'user', reject promise. Else return undefined.
    @params    [object]   user   [user object if found in db]
    @returns                     [Promise rejection if user, else undefined]
*/
function rejectOnUserExists(user) {
    return user ? Promise.reject('Username already taken.') : undefined;
}


/** Assemble new user object from request
    @params    [object]   ghProfile   [user's GitHub profile if found]
    @params    [object]   req         [the expres route's request object]
    @returns   [object]               [assembled user ready for save to db]
*/
function buildNewUser(ghProfile, req) {
    let user = new User();
    user.username  = req.body.username;
    user.github    = req.body.github;
    user.ghProfile = JSON.stringify(ghProfile);
    user.pref_lang = req.body.pref_lang;
    user.certs     = req.body.certs;
    user.time_zone = req.body.time_zone;
    user.hashPassword(req.body.password);
    return user;
}


/* ================================ ROUTES ================================= */

/* Route to handle new user signup.
   Returns fail status + message -or- success status + JWT
*/
routes.post('/api/register', (req, res) => {
    
    // fail if missing required inputs
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ 'message': 'Please complete all required fields.'});
    }
    
    User.findOne({ username: req.body.username})
        .exec()
        .then( rejectOnUserExists )
        .then( () => getGithubProfile(req) )
        .then( ghProfile => buildNewUser(ghProfile, req))
        .then( user => {
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
