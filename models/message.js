/* ================================= SETUP ================================= */

const mongoose = require('mongoose');


/* ================================ SCHEMA ================================= */

const messageSchema = new mongoose.Schema({

    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'COnversation',
        required: true
    },
    
    body: {
        type: String,
        required: true
    },
    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
},
{
    timestamps: true
});

/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Message', messageSchema);
