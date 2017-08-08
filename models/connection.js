const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const connectionSchema = new mongoose.Schema({

    mentor : {
        type     : String,
        required  : true
    },

    mentee : {
        type     : String,
        required : true
    },

    mentorName: {
        type     : String,
        required : true
    },

    menteeName: {
        type     : String,
        required : true
    },

    initiator : {
        type     : String,
        required : true
    },

    dateStarted : {
        type     : Date,
    },

    dateEnded : {
        type     : Date,
    },

    dateAccepted: {
        type     : Date,
    },

    dateDeclined: {
        type     : Date,
    },

    status : {
        type     : String,
        enum     : ['pending', 'accepted', 'declined', 'expired'],
        default  : 'pending',
    },
  }
);


/* ================================ EXPORT ================================= */

module.exports = mongoose.model('Connection', connectionSchema);
