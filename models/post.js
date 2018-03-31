/* ================================= SETUP ================================= */

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;


/* ================================ SCHEMA ================================= */

const postSchema = Schema({

    active : {
        type     : Boolean,
        default  : true
    },
    
    author : {
        type     : Schema.Types.ObjectId,
        ref      : 'User'
    },

    availability : {
        type     : String,
        trim     : true
    },

    body : {
        type     : String,
        required : true,
        trim     : true
    },

    excerpt : {
        type     : String,
        trim     : true
    },

    keywords : {
        type     : [String],  // array of strings
        required : true       // at least 1 element required
    },

    role : {
        type     : String,
        lowercase: true,
        enum     : ['mentor', 'mentee'],
        default  : 'mentee',
        trim     : true
    },

    title : {
        type     : String,
        required : true,
        trim     : true
    },

    deleted : {
        type     : Boolean,
        default  : false
    },

    meta : {
        views    : { type : Number, default  : 0, min : 0 },
        likes    : { type : Number, default  : 0, min : 0 }
    }
},
{
    timestamps : true
});

/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Post', postSchema);

