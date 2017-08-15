const mongoose  = require('mongoose');


/* ================================ SCHEMA ================================= */

const connectionSchema = new mongoose.Schema({

    mentor : {
      id: {
        type     : String,
        required  : true
      },
      name: {
        type     : String,
        required  : true
      },
      avatar: {
        type     : String,
      }
    },

    mentee : {
      id: {
        type     : String,
        required  : true
      },
      name: {
        type     : String,
        required  : true
      },
      avatar: {
        type     : String,
      }
    },

    initiator : {
      id: {
        type     : String,
        required  : true
      },
      name: {
        type     : String,
        required  : true
      },
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

    originalPost: {
      id: {
        type     : String,
        required  : true
      },
      title: {
        type     : String,
        required  : true
      },
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
