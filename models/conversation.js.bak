/* ================================= SETUP ================================= */

const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const conversationSchema = new mongoose.Schema({

    participants : [{
        type     : mongoose.Schema.Types.ObjectId,
		ref      : 'User'
    }]

});


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Conversation', conversationSchema);
