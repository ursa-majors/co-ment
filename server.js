/* jshint esversion:6, node:true */

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
//const db            = require('./db');
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

// auth TBD


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

//mongoose.connect(db.getDbConnectionString());
//mongoose.Promise = global.Promise;


/* ================================ STARTUP ================================ */

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
