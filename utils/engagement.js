/*
   User engagement email utility
*/

/* ================================= SETUP ================================= */

const User              = require('../models/user');
const Post              = require('../models/post');
const Log               = require('../models/log');
const mailer            = require('./mailer');
const { engagementTpl } = require('./mailtemplates');


/* =============================== UTILITIES =============================== */

/* determine eligibility of each user 
 * @params    [object]  user  [the user object from db ]
 * @returns   [boolean]       [true if conditions are met]
*/
function eligibleUsers(user) {

    let unSubbed         = user.contactMeta.unSubbed;
    let alreadyContacted = user.contactMeta.alreadyContacted;
    let createdInMs      = new Date(user.createdAt).getTime();
    let weekInMs         = 7 * 24 * 60 * 60 * 1000;
    let tooSoon          = createdInMs + weekInMs > Date.now();

    if (unSubbed || alreadyContacted || tooSoon) {
        return false;
    } else {
        return true;
    }

}


/* map/reduce posts to array of unique authors 
 * @params    [array]   posts  [array of post objects from db ]
 * @returns   [array]          [array of unique post author '_id's]
*/
function makePostAuthorsArr(posts) {

    const uniques = {};

    return posts
        .map( post => post.author_id )
        .sort( (a, b) => a - b )
        .reduce( (list, curr) => {
            if (!uniques[curr]) {
                uniques[curr] = 1;
                list.push(curr);
            }
            return list;
        }, []);
  
}


/* ============================ PRIVATE METHODS ============================ */


/** Check db logs for previous engagement run today
 *  @returns   [Promise]      [Promise object with Boolean payload]
*/
function checkAlreadyRun() {
    
    return Log.find()
        .sort({ 'createdAt' : -1 })
        .limit(1)
        .exec()
        .then(log => {
            
            if (log.length === 0) { return true; }
            
            let lastLogDate = Math.floor( Date.parse(log[0].createdAt) / 1000 );
            let today       = Math.floor( Date.now() / 1000 );
            let oneDay      = 86400;
        
            console.log('Last log taken: ', log[0].createdAt);
        
            return (today > lastLogDate + 86400) ? true : false;
            
        });
    
}



/** Get inactive users
 * @param     [array]     postAuthors   [all unique post authors]
 * @returns   [Promise]                 [Promise obj w/ inactive users]
*/
function getInactiveUsers(postAuthors) {
    
    const projection = { _id : 1, username : 1, name : 1, email : 1 };

    return User.find({}, projection)
        .exec()
        .then( users => users.filter(eligibleUsers) )
        .then( users => users.filter( u => {
            return postAuthors.indexOf(u._id.toString()) === -1;
        }));
}


/** Get list of all post authors
 * @param     [none]
 * @returns   [Promise]   [Promise object w/filtered list of post authors]
*/
function getPostAuthors() {

    return Post.find({})
        .exec()
        .then(makePostAuthorsArr);

}


/** Send email to applicable users
 * @param     [array]     users   [all inactive users]
 * @returns   [array]             [all inactive users]
*/
function sendEmail(users) {
    
    let count = 0;
    
    const subject = 'co/ment - Hot sustainment injection dispatch!';
    const body    = {
        type : 'html',
        text : engagementTpl
    };
    
//    // do the deed!
//    users.forEach( user => {
//        
//        try {
//            mailer(user.email, subject, body);
//            count += 1;
//        } catch (err) {
//            console.log(`Error: $(err)`);
//        }
//        
//    });

    console.log(`Sent ${count} reminder emails.`);
    
    return users;
}


/** save operation log to database
 * @param     [array]   users     [all inactive users]
 * @returns   [array]             [all inactive users]
*/
function saveLog(users) {
    
    const newLog = new Log({
        category : 'engagement_email',
        affectedUsers : users,
		actionTaken: 'dispatched_emails'
    });
    
    newLog.save( (err, result) => {
        if (err) { throw new Error(err); }
        console.log('Log save result: ', result);
    });
    
    return users;
}


/** log some stats
 * @param   [array]   users   [all inactive users]
*/
function logStats(users) {
    console.log(`
***************************************************
                      STATS
***************************************************
${users.length} users are 7 days old and have no posts:

${users.map( u => u._id + ' ( ' + u.username + ' )' ).join('\n')}
    `);
}


/* =========================== EXPORT PUBLIC API =========================== */

module.exports = function() {
    
    // first, check logs. If last log.createAd = today, abort
    checkAlreadyRun()
        .then(result => {
            
            if (result === true) {
                getPostAuthors()
                    .then(getInactiveUsers)
                    .then(sendEmail)
                    .then(saveLog)
                    .then(logStats);
            } else {
                return Promise.reject('Too soon to send engagement emails');
            }
        
        })
        .catch(err => {
            console.log(err);
        });
    
};
