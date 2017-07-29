/* Co/Ment API
     (c) 2017 - The Ursa Majors
     https://github.com/ursa-majors/co-ment
*/

/* ================================= SETUP ================================= */

const express       = require('express');
const app           = express();
const morgan        = require('morgan');
const bodyParser    = require('body-parser');

// passport auth
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// db
const db            = require('./db');
const mongoose      = require('mongoose');

// db models
const User          = require('./models/user');
const Post          = require('./models/post');

// routes
const apiRoutes     = require('./routes/apiroutes');
const authRoutes    = require('./routes/authroutes');
const staticRoutes  = require('./routes/staticroutes');

// port
const port          = process.env.PORT || 3000;


/* ============================= CONFIGURATION ============================= */

// enable logger
app.use(morgan('dev'));

// enable http request body parsing
app.use(bodyParser.urlencoded({ 'extended' : 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


/* =============================== PASSPORT ================================ */

app.use(passport.initialize());

passport.use(new LocalStrategy(

    // Authenticate users by username & password
    function(username, password, done) {
        User.findOne(
            // query - find by username
            { username : username },
            // projection - select only username, salt and hash
            { username : 1, salt : 1, hash : 1},
            // callback - gets error & result of query
            (err, user) => {
                
                // denial
                if (err) {
                    return done(err);
                }
                
                // anger
                if (!user) {
                    return done(null, false, { message : 'Invalid User Name'});
                }
                
                // bargaining
                if (!user.validatePassword(password)) {
                    return done(null, false, { message: 'Invalid Password'});
                }
                
                // acceptance!
                return done(null, user);
                
            });
    }
    
));


/* ================================ ROUTES ================================= */

app.use(authRoutes);
app.use(apiRoutes);
app.use(staticRoutes);


/* ============================= ERROR HANDLER ============================= */

app.use( (err, req, res, next) => {
    console.log('Error\n', err.stack);
    res.status(500).send('Something broke...');
});


/* ============================= CONNECT TO DB ============================= */

// new Mongo ( >= 4.11.0 ) connection logic:
mongoose.connect(db.getDbConnectionString(), {
    useMongoClient: true
});

// old Mongo connection logic (may be needed for Heroku):
//mongoose.connect(db.getDbConnectionString());

// tell Mongoose to use Node global es6 Promises
mongoose.Promise = global.Promise;


/* ================================ STARTUP ================================ */

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
