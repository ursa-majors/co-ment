/* ================================= SETUP ================================= */

const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const conversationSchema = new mongoose.Schema({
    
    subject : {
        type     : String,
        trim     : true,
        required : true
    },

    participants : [{
        type     : mongoose.Schema.Types.ObjectId,
		ref      : 'User'
    }],
    
    messages : [{
        type     : mongoose.Schema.Types.ObjectId,
		ref      : 'Message'
    }],
    
    startDate : {
        type     : Date,
        default  : new Date().toISOString()
    }

});


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Conversation', conversationSchema);
