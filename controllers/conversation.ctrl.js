/*
   route controllers to handle in-app messaging CRUD
*/

/* ================================= SETUP ================================= */

const Conversation = require('../models/conversation');
const Message      = require('../models/message');


/* ============================ ROUTE HANDLERS ============================= */

// GET CONVERSATIONS
//   Example: GET >> /api/conversations
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//   Returns: array of user's conversations with most recent messages.
//
function getConversations(req, res) {

    const query = {
        participants: req.token._id
    };

    Conversation.find(query)
        .select('_id')
        .exec()
        .then( cons => {

            const promiseList = [];

            cons.forEach( con => {

                // target messages by conversation '_id'
                const messageQuery = {
                    conversation : con._id
                };

                promiseList.push( new Promise( resolve => {
                    return Message.find(messageQuery)
                        .sort('-createdAt')
                        .limit(1)
                        .populate({
                            path   : 'author',
                            select : 'username name avatarUrl'
                        })
                        .exec()
                        .then( msgs => resolve(msgs[0]) );
                }));

            });

            return Promise.all(promiseList);

        })
        .then( populatedCons => res.status(200).json( populatedCons ))
        .catch( err => {
            return res
                .status(400)
                .json({ message: err });
        });
}


// GET ALL MESSAGES IN A CONVERSATION
//   Example: GET >> /api/conversations/:id
//   Secured: yes, valid JWT required
//   Expects:
//     1) conversation '_id' from the request params
//   Returns: array of messages from single conversation.
//
function getConversation(req, res) {
    Message.find({ conversation: req.params.id })
        .select('createdAt body author')
        .sort('-createdAt')
        .populate({
            path   : 'author',
            select : 'username name avatarUrl'
        })
        .exec()
        .then( messages => {
            return res
                .status(200)
                .json({ conversation: messages });
        })
        .catch( err => {
            return res
                .status(400)
                .json({ message: err });
        });
}


// CREATE NEW CONVERSATION
//   Example: POST >> /api/conversations
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//     2) request body properties
//          recipientId : String
//          message     : String
//        }
//   Returns: success message on success
//
function createConversation(req, res, next) {

    if(!req.body.recipientId) {
        return res
            .status(422)
            .json({ message: 'Missing recipient ID.' });
    }

    if(!req.body.message) {
        return res
            .status(422)
            .json({ message: 'Missing message.' });
    }

    const conversation = new Conversation({
        participants: [req.token._id, req.body.recipientId]
    });

    conversation.save( (err, newConversation) => {
        if (err) {
            console.log('Error!', err);
            return next(err);
        }

        const message = new Message({
            conversation : newConversation._id,
            body         : req.body.message,
            author       : req.token._id
        });

        message.save( (err, newMessage) => {
            if (err) {
                console.log('Error!', err);
                return next(err);
            }

            return res
                .status(200)
                .json({
                    message: 'Conversation started!',
                    conversation: conversation._id
                });
        });
    });
}


// CREATE NEW MESSAGE
//   Example: POST >> /api/messages
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//     2) request body properties
//          conversation : String
//          messageBody  : String
//        }
//   Returns: success message on success
//
function postMessage (req, res) {
    const message = new Message({
        conversation : req.body.conversation,
        body         : req.body.messageBody,
        author       : req.token._id
    });

    message.save( (err, sentMessage) => {
        if (err) {
            console.log('Error!', err);
            return res.send({ error: err });
        }

        return res
            .status(200)
            .json({ message: 'Message sent!' });
    });
}


/* ============================== EXPORT API =============================== */

module.exports = {
    getConversations, getConversation, createConversation, postMessage
};
