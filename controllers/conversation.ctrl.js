/*
   route controllers to handle in-app messaging CRUD
*/


/* ================================= SETUP ================================= */

const Conversation        = require('../models/conversation');
const Message             = require('../models/message');
const User                = require('../models/user');
const mailer              = require('../utils/mailer');
const { unreadsReminder } = require('../utils/mailtemplates');


/* =============================== UTILITIES =============================== */


/* Count unread messages where the user = 'recipient'
 * @param     [array]    collection   [array of elements we want to filter]
 * @param     [string]   user         [user's _id]
 * @returns   [number]                [number of unread messages]
*/
function countUnreads(collection, user) {
    return collection.filter( el => {
        return el.unread && el.recipient.toString() === user;
    }).length;
}


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
function formatConvData(convs, user) {

    // count all messages
    const totalMessages = convs.reduce( (sum, conv) => {
        return sum + conv.messages.length;
    }, 0);

    // count unread messages where user is the recipient
    const totalUnreads = convs.reduce( (sum, conv) => {
        return sum + countUnreads(conv.messages, user);
    }, 0);

    // remap conversations to include metadata
    const conversations = convs.map( c => {
        return {
            _id           : c._id,
            subject       : c.subject,
            qtyMessages   : c.messages.length,
            qtyUnreads    : countUnreads(c.messages, user),
            startDate     : c.startDate,
            participants  : c.participants,
            latestMessage : c.messages[c.messages.length - 1]
        };
    });

    return { totalMessages, totalUnreads, conversations };
}


/* Add array of messages to conversations
 * If 'convos' is an array, return summary list of conversations.
 * If 'convos' is an object, return conversation with messages and
 * set message 'unread' to false
 * 
 * @params    [object]   convos   [array of conv objects or single conv object]
 * @params    [string]   user     [user's '_id']
 * @returns   [object]            [populated conversation(s)]
*/
function populateMessages(convos, user) {

    let convIsArray = Array.isArray(convos);

    if (convIsArray) {
        return Message.find({ $or: [ { author : user }, { recipient : user } ]})
            .sort({ createdAt: -1 })
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

                // Update message unread fields to 'false'.
                // Targets only messages where 'user' = 'recipient'
                // We build an 'udates' array of 'findOneAndUpdate'
                // queries using '.map()' on the 'msgs' array:
                const updates = msgs.map( msg => {
                    return Message.findOneAndUpdate(
                        { '_id'  : msg._id, 'recipient' : user },  // filter
                        { '$set' : { 'unread' : false } },         // updates
                        { new    : true }                          // options
                    );
                });

                // Then execute each query in the array at once
                // and return all messages
                return Promise.all(updates)
                    .then( () => msgs );

            })
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


/* Check whether user should be contacted
 *
 * @param     [object]   contactMeta   [user's nested contactMeta document]
 * @returns   [boolean]                [true if OK to contact the user]
*/
function okToContact(contactMeta) {
    return !contactMeta.unsubscribed && !contactMeta.alreadyContacted;
}


/* Dispatch reminder email to user if OK to do so
 * First, gets recipient's user document and check contactMeta.
 *     if `contactMeta.unsubscribed`     = true, fail
 *     if `contactMeta.alreadyContacted` = true, fail
 * ... else: dispatch reminder email.
 * 
 * @params    [string]   recipient   [recipient's user _id]
*/
function duckDuckSpam(recipient) {
    
    const projection = {
        username : 1,
        email    : 1,
        'contactMeta.unsubscribed'     : 1,
        'contactMeta.alreadyContacted' : 1
    };
    
    User.findById(recipient, projection)
        .exec()
        .then( user => {

            if (!okToContact(user.contactMeta)) {
                // not ok to contact
                console.log('Not ok to email unreads waiting message.');
                return false;
            } else {
                // OK to contact - dispatch email
                console.log(`Emailing reminder to ${user.username}.`);
                
                sendReminderEmail({
                    to_name  : user.username,
                    to_email : user.email
                });
                
                // update user's `contactMeta.alreadyContacted` field
                user.contactMeta.alreadyContacted = true;
                user.save( err => {
                    if (err) { throw new Error(err); }
                    console.log(`${user.username}'s 'alreadyContacted' set to true.`);
                });
                
                return true;
            }
        
        })
        .catch( err => {
            throw new Error(err);
        });
    
}


function sendReminderEmail(params) {

    const url     = 'https://co-ment-dev.glitch.me/inbox';
    const subject = 'co/ment - New unread messages';
    const body    = {
        type: 'html',
        text: unreadsReminder(url, params.to_name)
    };

    // send mail using `mailer` util
    try {
        mailer(params.to_email, subject, body);
        console.log('Unreads reminder email sent successfully.');
        console.log('emailing: ', params.to_email);
        console.log('subject : ', subject);
    } catch (err) {
        console.log(`Error: $(err)`);
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
        .then( convos => formatConvData(convos, req.token._id) )

        .then( data => res.status(200).json(data) )
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

    if(!req.body.subject) {
        return res
            .status(422)
            .json({ message: 'Missing subject.' });
    }

    const conversation = new Conversation({
        subject     : req.body.subject,
        participants: [req.token._id, req.body.recipientId]
    });

    const message = new Message({
        conversation   : conversation._id,
        body           : req.body.message,
        author         : req.token._id,
        recipient      : req.body.recipientId,
        originatedFrom : 'connection'
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
//   Triggers check for & send 'unreads available' email to recipient
//
function postMessage (req, res) {
    const message = new Message({
        conversation   : req.body.conversation,
        body           : req.body.messageBody,
        author         : req.token._id,
        recipient      : req.body.recipientId,
        originatedFrom : 'conversation'
    });

    message.save( (err, sentMessage) => {
        if (err) {
            console.log('Error!', err);
            return res.send({ error: err });
        }
        
        // call utility to check for and send unreads waiting email
        duckDuckSpam(message.recipient);

        return res
            .status(200)
            .json({ message: message, });
    });
}


/* ============================== EXPORT API =============================== */

module.exports = {
    getConversations,
    getConversation,
    createConversation,
    postMessage
};
