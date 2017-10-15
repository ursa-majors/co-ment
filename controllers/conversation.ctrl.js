/*
   route controllers to handle in-app messaging CRUD
*/

/* ================================= SETUP ================================= */

const Conversation = require('../models/conversation');
const Message      = require('../models/message');


/* =============================== UTILITIES =============================== */

/* Build 'getConversations' response object from conversations array
 * @params    [array]   convs   [array of conversation objects]
 * @returns   [object]          [formatted response]
 *
 *   {
 *      totalMessages : Number,
 *      totalUnreads  : Number,
 *      conversations : [
 *          {
 *              _id         : String,
 *              subject     : String,
 *              startDate   : String,
 *              qtyMessages : Number,
 *              qtyUnreads  : Number,
 *              latestMessage : {
 *                  _id       : String,
 *                  updatedAt : String,
 *                  createdAt : String,
 *                  body      : String,
 *                  author    : String,
 *                  recipient : String,
 *                  unread    : Boolean
 *              },
 *              participants : [
 *                  {
 *                      _id       : String,
 *                      username  : String,
 *                      name      : String,
 *                      avatarUrl : String
 *                  }...
 *              ]
 *          }
 *      ]
 *   }
*/
function formatConvData(convs) {

    // count all messages
    const totalMessages = convs.reduce( (sum, conv) => {
        return sum + conv.messages.length;
    }, 0);

    // count unread messages where user is the recipient
    const totalUnreads = convs.reduce( (sum, conv) => {
        return sum + conv.messages.filter( m => m.unread ).length;
    }, 0);

    // remap conversations to include metadata
    const conversations = convs.map( c => {
        return {
              _id           : c._id,
            subject       : c.subject,
            qtyMessages   : c.messages.length,
            qtyUnreads    : c.messages.filter( m => m.unread ).length,
            startDate     : c.startDate,
            participants  : c.participants,
            latestMessage : c.messages[c.messages.length - 1]
        };
    });

    return { totalMessages, totalUnreads, conversations };
}


/* Add array of messages to conversations
 * @params    [object]   convos   [array of conv objects or single conv object]
 * @params    [string]   user     [user's '_id']
 * @returns   [object]            [populated conversation(s)]
*/
function populateMessages(convos, user) {

    let convIsArray = Array.isArray(convos);

    if (convIsArray) {
        return Message.find({ $or: [ { author : user }, { recipient : user } ]})
            .exec()
            .then( msgs => {

                return convos.map( c => {
                    let messages = msgs.filter( m => {
                        return m.conversation.toString() === c._id.toString();
                    });
                    return {
                        _id          : c._id,
                        subject      : c.subject,
                        participants : c.participants,
                        startDate    : c.startDate,
                        messages     : messages
                    };
                });

        });
    } else {
        return Message.find({ conversation : convos._id })
            .exec()
            .then( msgs => {

                return {
                    _id          : convos._id,
                    subject      : convos.subject,
                    participants : convos.participants,
                    startDate    : convos.startDate,
                    messages     : msgs
                };

        });
    }

}


/* ============================ ROUTE HANDLERS ============================= */

// GET CONVERSATIONS - with projection!
//   Example: GET >> /api/conversations
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//   Returns: array of user's conversations with most recent messages.
//
function getConversations(req, res) {

    Conversation.find({ participants: req.token._id })
        .select('subject startDate messages participants')

        // add conversation participant details
        .populate({
            path   : 'participants',
            select : 'username name avatarUrl'
        })
        .exec()

        // add messages to each conversation in the results array
        .then( convos => populateMessages(convos, req.token._id) )

        // get unreads and filter messages
        .then( formatConvData )

        .then( data => res.status(200).json(data) )
        .catch( err => {
            return res
                .status(400)
                .json({ message: err });
        });
}


// GET CONVERSATIONS -- WITH AGGREGATE
//   Example: GET >> /api/conversations
//   Secured: yes, valid JWT required
//   Expects:
//     1) user '_id' from JWT token
//   Returns: array of user's conversations with most recent messages.
//
function getConversationsAggregate(req, res) {

    const query = {
        participants: req.token._id
    };

    Conversation.find(query)
        .exec()
        .then( cons => {

            // simple array of conversation IDs
            const conIdsArr = cons.map( c => c._id );

            Message.aggregate([
                {
                    $match: { 'conversation' : { $in : conIdsArr} }
                },
                {
                    $lookup: {
                        from         : 'conversations',
                        localField   : 'conversation',
                        foreignField : '_id',
                        as           : 'conv_docs'
                    }
                },
                {
                    $project: {
                        'createdAt'    : 1,
                        'conversation' : 1,
                        'body'         : 1,
                        'author'       : 1,
                        'recipient'    : 1,
                        'unread'       : 1,
                        'subject'      : '$conv_docs.subject',
                        'partcipants'  : '$conv_docs.participants'
                    }
                },
                {
                    $sort: {
                        'conversation' : 1,
                        'createdAt'    : -1
                    }
                },
                {
                    $group: {
                        _id          : '$conversation',
                        subject      : { $first: '$subject' },
                        totalMsgs    : { $sum : 1 },
                        unreads      : { $sum : { $cond : [ '$unread', 1, 0 ]} },
                        participants : { $first: '$partcipants' },
                        messages     : { $push: '$$CURRENT' },
                    }
                }
            ])
            .exec()
            .then( messages => {
                return res
                    .status(200)
                    .json({'conversations' : messages});
            });
        })
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

    Conversation.findById(req.params.id)
        .select('subject startDate messages participants')
        .populate({
            path : 'participants',
            select: 'username name avatarUrl'
        })
        .exec()

        // add messages array to the conversation
        .then( convo => populateMessages(convo, req.token._id) )

        .then( data => res.status(200).json(data) )
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
//          subject     : String
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

    if(!req.body.message) {
        return res
            .status(422)
            .json({ message: 'Missing subject.' });
    }

    const conversation = new Conversation({
        subject     : req.body.subject,
        participants: [req.token._id, req.body.recipientId]
    });

    const message = new Message({
        conversation : conversation._id,
        body         : req.body.message,
        author       : req.token._id,
        recipient    : req.body.recipientId
    });

    conversation.messages.push(message._id);

    conversation.save( (err, newConversation) => {
        if (err) {
            console.log('Error!', err);
            return next(err);
        }

        message.save( (error, newMessage) => {
            if (error) {
                console.log('Error!', error);
                return next(error);
            }

            return res
                .status(200)
                .json({
                    message: 'Conversation started!',
                    conversation: conversation
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
//          recipientId  : String
//          conversation : String
//          messageBody  : String
//        }
//   Returns: new message object
//
function postMessage (req, res) {
    const message = new Message({
        conversation : req.body.conversation,
        body         : req.body.messageBody,
        author       : req.token._id,
        recipient    : req.body.recipientId
    });

    message.save( (err, sentMessage) => {
        if (err) {
            console.log('Error!', err);
            return res.send({ error: err });
        }

        return res
            .status(200)
            .json({ message: message, });
    });
}


/* ============================== EXPORT API =============================== */

module.exports = {
    getConversations : getConversations,
//    getConversations : getConversationsAggregate,
    getConversation : getConversation,
    createConversation : createConversation,
    postMessage : postMessage
};
