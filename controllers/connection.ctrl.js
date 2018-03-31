/*
   functions to handle connection retrieval, creation and updating
*/

/* ================================= SETUP ================================= */

const Connection = require('../models/connection');


/* ============================ ROUTE HANDLERS ============================= */

// GET CONNECTIONS
//   Example: GET >> /api/connections
//   Secured: yes, valid JWT required
//   Expects:
//     1) the user's _id from the JWT token
//   Returns: array of connections on success
//
function getConnections(req, res) {
    const target = req.token._id;

    Connection.find({
        $or: [
            { "mentor.id": target },
            { "mentee.id": target }
        ]})
        .exec()
        .then( (conns) => {

            return res
                .status(200)
                .json({ connections: conns });

        })
        .catch( (error) => {

            console.log(`Error: $(error)`);
            return res
                .status(400)
                .json({ message : 'Error: Cannot get connections' });

    });

}


// CREATE CONNECTION
//   Example: POST >> /api/connect
//   Secured: yes, valid JWT required
//   Expects:
//     1) request body properties : {
//          mentor          : id
//          mentee          : id
//          mentorName      : string
//          menteeName      : string
//          initiator       : id
//          status          : 'pending'
//          conversationID  : string
//        }
//   Returns: success message & connection _id on success
//
function createConnection(req, res) {

    let newConn = new Connection(req.body);

    newConn.dateStarted = Date.now();

    newConn
        .save( (err, conn) => {
            if (err) { throw err; }

            return res
                .status(200)
                .json({ message: "Connection created", connectionId: conn._id});

        })
        .catch( (err) => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
        });

}

// Update a connection record's status & status date
//   Example: POST >> /api/updateconnection
//   Secured: yes, valid JWT required
//   Expects:
//     1) request body properties : {
//          id   : id
//          type : String
//        }
//   Returns: updated connection record on success
//
function updateConnection(req, res) {

    const target = { _id: req.body.id };

    let update;

    switch (req.body.type) {

        case 'ACCEPT':
            update = {
                status: 'accepted',
                dateAccepted: Date.now()
            };
            break;

        case 'DECLINE':
            update = {
                status: 'declined',
                dateDeclined: Date.now()
            };
            break;

        case 'DEACTIVATE':
            update = {
                status: 'inactive',
                dateExpired: Date.now()
            };
            break;

        default:
            update = {};

    }

    const options = {
        new: true  // return updated document rather than original
    };

    Connection.findOneAndUpdate(target, update, options)
        .exec()
        .then( (conn) => {
            return res
                .status(200)
                .json({ conn });
        })
        .catch( (err) => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
        });
}


/* ============================== EXPORT API =============================== */

module.exports = { getConnections, createConnection, updateConnection };
