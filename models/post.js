/* ================================= SETUP ================================= */

const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const postSchema = new mongoose.Schema({
    
    active : {
        type     : Boolean,
        default  : true
    },
    
    author : {
        type     : String,
        required : true
    },
    
    author_id : {
        type     : String,
        required : true
    },
    
    availability : String,
    
    body : {
        type     : String,
        required : true,
        trim     : true
    },
    
    keywords : {
        type     : [String],  // array of strings
        required : true       // at least 1 element required
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
    
    updated : {
        type     : Date,
        default  : Date.now
    }
    
});


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Post', postSchema);

