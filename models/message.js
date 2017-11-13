/* ================================= SETUP ================================= */

const mongoose = require('mongoose');


/* ================================ SCHEMA ================================= */

const messageSchema = new mongoose.Schema({

    conversation: {
        type     : mongoose.Schema.Types.ObjectId,
        required : true
    },

    body: {
        type     : String,
        required : true
    },

    subject: {
        type: String,
    },

    author: {
        type     : mongoose.Schema.Types.ObjectId,
        ref      : 'User'
    },
    
    recipient: {
        type     : mongoose.Schema.Types.ObjectId,
        ref      : 'User'
    },
    
    unread: {
        type     : Boolean,
        default  : true
    },
    
    originatedFrom : {
        type     : String,
        enum     : ['connection', 'conversation']
    }

},
{
    timestamps: true
});

/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Message', messageSchema);
