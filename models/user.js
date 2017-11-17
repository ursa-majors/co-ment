/* ================================= SETUP ================================= */

const detenv   = require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const jwt      = require('jsonwebtoken');
const crypto   = require('crypto');
const secret   = process.env.JWT_SECRET;


/* ================================ SCHEMA ================================= */

const userSchema = new mongoose.Schema({

    username: {
        type   : String,
        unique : true
    },

    email      : {
        type     : String,
        unique   : true,
        required : true
    },

    name       : {
        type     : String,
        trim     : true
    },

    ghUserName : {
        type     : String,
        trim     : true
    },

    ghProfile  : Object,

    avatarUrl  : {
        type     : String,
        trim     : true
    },

    location   : {
        type     : String,
        trim     : true
    },

    about      : {
        type     : String,
        trim     : true
    },

    gender     : {
        type     : String,
        trim     : true
    },

    github    : {
        type     : String,
        trim     : true
    },

    twitter    : {
        type     : String,
        trim     : true
    },

    facebook   : {
        type     : String,
        trim     : true
    },

    link       : {
        type     : String,
        trim     : true
    },

    linkedin   : {
        type     : String,
        trim     : true
    },

    codepen    : {
        type     : String,
        trim     : true
    },

    signupKey  : {
        key    : String,
        ts     : String,
        exp    : String
    },

    passwordResetKey: {
        key : String,
        ts  : String,
        exp : String,
    },

    validated  : {
        type     : Boolean,
        default  : false
    },

    languages  : [String],

    certs      : [String],

    skills     : [String],

    time_zone  : {
        type     : String,
        trim     : true
    },

    likedPosts : [String],
    
    contactMeta : {
        unSubbed           : { type : Boolean, default: false },
        alreadyContacted   : { type : Boolean, default: false }
    },
    
    engagementMeta : {
        addPostReminder    : { type : Date, default : Date.now },
        addProfileReminder : { type : Date, default : Date.now }
    },

    hash       : String,

    salt       : String

},
{
    timestamps : true
});

userSchema.plugin(passportLocalMongoose);


/* ================================ METHODS ================================ */

// salt and hash passwords based on 'this' user object
userSchema.methods.hashPassword = function (pwd) {

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex');

};


// hash and compare submitted passwords to stored hashes in db.
// return 'true' if match
userSchema.methods.validatePassword = function (pwd) {
    const hash = crypto.pbkdf2Sync(pwd, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};


// Generate and return signed JWT based on 'this' user object
userSchema.methods.generateJWT = function () {

    const payload = {
        _id       : this._id,
        username  : this.username,
        validated : this.validated
    };
    const options = {
        expiresIn : '7d'
    };

    return jwt.sign(payload, secret, options);

};


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('User', userSchema);
