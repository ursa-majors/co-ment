/* Co/Ment API
     (c) 2017 - The Ursa Majors
     https://github.com/ursa-majors/co-ment
*/

/* ================================= SETUP ================================= */

const express       = require('express');
const app           = express();
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const path          = require('path');
const comentCors    = require('./config/cors');

// passport auth
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const strategy      = require('./config/strategy');

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

// error handler
const errorHandler  = require('./utils/errorhandler');

// email functions
const engagement    = require('./utils/engagement');

// port
const port          = process.env.PORT || 3001;


/* ============================= CONFIGURATION ============================= */

// enable logger
app.use(morgan('dev'));

// enable http request body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));


/* ================================= CORS ================================= */

app.use(comentCors);


/* =============================== PASSPORT ================================ */

app.use(passport.initialize());
passport.use(strategy(LocalStrategy, User));


/* ================================ ROUTES ================================= */

app.use('/api', authRoutes);
app.use('/api', apiRoutes);
app.use(staticRoutes);


/* ============================= ERROR HANDLER ============================= */

app.use(errorHandler);


/* ============================= CONNECT TO DB ============================= */

// new Mongo ( >= 4.11.0 ) connection logic:
mongoose.connect(db.getDbConnectionString(), {
    useMongoClient: true
});

// old Mongo connection logic (may be needed for Heroku):
//mongoose.connect(db.getDbConnectionString());

// log mongoose connection errors to console
mongoose.connection.on('error', function(err) {
    console.error('Mongoose connection error: ', err);
});

// tell Mongoose to use Node global es6 Promises
mongoose.Promise = global.Promise;


/* ================================ STARTUP ================================ */

app.listen(port, () => {
    engagement();
    console.log(`Server listening on port ${port}.`);
});
