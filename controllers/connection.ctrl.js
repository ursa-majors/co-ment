/* ================================= SETUP ================================= */

const Connection = require('../models/connection');


/* ============================ PUBLIC METHODS ============================= */

/* GET CONNECTIONS
   Expects the user's _id from the JWT token
   Example: GET > /api/connections
*/
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

/* CREATE CONNECTION
   Expects post body:
   {
     mentor     : id,
     mentee     : id,
     mentorName : string,
     menteeName : string,
     initiator  : id,
     status     : 'pending'
   }
   Example: POST > /api/connect
*/
function createConnection(req, res) {
    
    let newConn = new Connection(req.body);
    
    newConn.dateStarted = Date.now();
    
    newConn
        .save( (err, conn) => {
            if (err) { throw err; }

            return res
                .status(200)
                .json({ message: "Connection created" });

        })
        .catch( (err) => {
            console.log('Error!!!', err);
            return res
                .status(400)
                .json({ message: err });
        });
    
}

/* UPDATE A CONNECTION
   Expects post body:
   {
     id   : id,
     type : String
   }
   Example: PUT > /api/connections
*/
function updateConnection(req, res) {

    const target = {
        _id: req.body.id
    };

    let update;

    switch (req.body.type) {

        case 'ACCEPT':
            update = {
                status: 'accepted',
                dateAccepted: Date.now(),
            };
            break;

        case 'DECLINE':
            update = {
                status: 'declined',
                dateDeclined: Date.now(),
            };
            break;

        case 'EXPIRE':
            update = {
                status: 'expired',
                dateExpired: Date.now(),
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

module.exports = {
  getConnections   : getConnections,
  createConnection :createConnection,
  updateConnection : updateConnection
};
