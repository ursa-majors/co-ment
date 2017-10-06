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
    
    // count unread messages
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
            latestMessage : c.messages[0]
        };
    });
    
    return { totalMessages, totalUnreads, conversations };
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
        .populate({
            path : 'participants',
            select: 'username name avatarUrl'
        })
        .populate({
            path    : 'messages',
            select  : 'updatedAt createdAt body author recipient unread',
            options : {
                sort  : { createdAt: -1 },
            }
        })
        .exec()
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
    Message.find({ conversation: req.params.id })
        .select('createdAt body author unread')
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
//          recipientId  : String
//          conversation : String
//          messageBody  : String
//        }
//   Returns: success message on success
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
            .json({ message: 'Message sent!' });
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
