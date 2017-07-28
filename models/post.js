/* jshint esversion:6, node: true */


/* ================================= SETUP ================================= */

const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const postSchema = new mongoose.Schema({
    
    author : {
        type     : String,
        required : true
    },
    
    role : {
        type     : String,
        enum     : ['mentor', 'mentee'],
        default  : 'mentee'
    },
    
    title : {
        type     : String,
        required : true,
        trim     : true
    },
    
    body : {
        type     : String,
        required : true,
        trim     : true
    },
    
    keywords : {
        type     : [String],  // array of strings
        required : true       // at least 1 element required
    },
    
    availability : String,
    
    updated : {
        type     : Date,
        default  : Date.now
    }
    
});


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Post', postSchema);

