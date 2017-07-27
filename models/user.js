/* jshint esversion:6, node: true */


/* ================================= SETUP ================================= */

const detenv    = require('dotenv').config();
const mongoose  = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const jwt       = require('jsonwebtoken');
const crypto    = require('crypto');
const secret    = process.env.JWT_SECRET;


/* ================================ SCHEMA ================================= */

const userSchema = new mongoose.Schema({
    
    username: {
        type   : String,
        unique : true
    },
    
    pref_lang  : String,
    
    certs      : [String],
    
    time_zone  : String,
    
    hash       : String,
    
    salt       : String
    
});

userSchema.plugin(passportLocalMongoose);


/* ================================ METHODS ================================ */

// salt and hash passwords based on 'this' user object
userSchema.methods.hashPassword = function (pwd) {
    
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex');
    
};


// Generate and return signed JWT based on 'this' user object
userSchema.methods.generateJWT = function () {
    
    const payload = {
        _id      : this._id,
        username : this.username
    };
    const options = {
        expiresIn : '7d'
    };
    
    return jwt.sign(payload, secret, options);
    
};


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('User', userSchema);

