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

/** determine basic eligibility of each user
 *  Checks:
 *    user.createdAt (Date) - if > 1 week ago, user is eligible
 *    contactMeta.unSubbed (Boolean) - if 'false', user is eligible
 *  @param     {object}     user   The user object from db
 *  @returns   {boolean}           True if user is eligible for email
*/
function basicEligibility(user) {

    let unSubbed    = user.contactMeta.unSubbed;
    let createdInMs = new Date(user.createdAt).getTime();
    let weekInMs    = 7 * 24 * 60 * 60 * 1000;
    let tooSoon     = createdInMs + weekInMs > Date.now();

    // if user has unSubbed or it's too soon, user is not eligible
    return (unSubbed || tooSoon) ? false : true;    
}


/** determine what type of engagement email to send an eligibile user
 *  Checks for existence of `user.name`, a required field when updating
 *  a user profile.
 *  @param     {object}    user   The user object from db
 *  @returns   {object}           User object w/property 'engageType'
*/
function addEngagementType(user) {

    if (!user.name) {
        user.engageType = 'profile';
    } else {
        user.engageType = 'post';
    }

    return user;
}


/** determine final eligibility of each user
 *  Purpose: don't contact users who have already been contacted re: `engageType`
 *  Checks:
 *    user.engageType (either 'profile' or 'post')
 *    user.engagementMeta dates ('addProfileReminder' and 'addPostReminder')
 *  @param     {object}     user   The user object from db
 *  @returns   {boolean}           True if user is eligible for email
*/
function finalEligibility(user) {
    
    let prevProfileEngSent = Boolean(user.engagementMeta.addProfileReminder);
    let prevPostEngSent    = Boolean(user.engagementMeta.addPostReminder);
    
    // fail if user has already been emailed to update their profile
    if (user.engageType === 'profile' && prevProfileEngSent) {
        return false;
    }
    
    // fail if user has already been emailed to add a post
    if (user.engageType === 'post' && prevPostEngSent) {
        return false;
    }
    
    return true;
}


/** map/reduce posts to array of unique authors 
 *  @param     {array}   posts   Array of post objects from db
 *  @returns   {array}           Array of unique post author '_id's
*/
function makePostAuthorsArr(posts) {

    const uniques = {};

    return posts
        .map( post => post.author.toString() )  // Obj >> String
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
 *  @returns   {Promise}      Promise object with Boolean payload
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
//            return true;

        });

}


/** Get inactive users
 *  Finds all users, then filters for users who have NOT authored posts.
 *  @param     {array}     postAuthors   All unique post authors
 *  @returns   {Promise}                 Promise w/array of inactive users
*/
function getInactiveUsers(postAuthors) {

    const projection = {
        _id            : 1,
        username       : 1,
        name           : 1,
        email          : 1,
        contactMeta    : 1,
        engagementMeta : 1
    };

    return User.find({}, projection)
        .exec()

        // filter for basic elegibility
        .then( users => users.filter(basicEligibility) )

        // filter for only users who haven't authored posts
        .then( users => users.filter( u => {
            return postAuthors.indexOf(u._id.toString()) === -1;
        }))

        // determine what type of engagement email to send
        .then( users => users.map(addEngagementType))

        // filter based on whether previous engagement email was sent
        .then( users => users.filter(finalEligibility) );

}


/** Get list of all post authors
 *  @returns   {Object}   Promise object w/filtered list of post authors
*/
function getPostAuthors() {

    return Post.find({})
        .exec()
        .then(makePostAuthorsArr);

}


/** Send email to applicable users
 *  @param     {array}     users   All inactive users
 *  @returns   {array}             All emailed users
*/
function sendEmail(users) {

//    const pool = users.map( user => {
//
//        let subject = 'co/ment - Operation: User Engagement!';
//        let body    = {
//            type : 'html',
//            text : engagementTpl(user.engageType)
//        };
//
//        return new Promise( (resolve, reject) => {
//            try {
//                mailer(user.email, subject, body);
//                resolve();
//            }
//            catch (err) {
//                reject(err);
//            }
//        });
//    });
//
//    return Promise.all(pool)
//        .then( () => {
//            console.log(`Sent ${pool.length} reminder emails.`);
//            return users;
//        });
    
    return users;

}


/** update user records 
 *  Set appropriate `engagementMeta` property depending on `engageType`.
 *  @param     {array}   users     All inactive users
 *  @returns   {array}             All inactive users
*/
function updateUserRecords(users) {
    
    const pool = users.map( user => {

        let updates = {};

        if (user.engageType === 'profile') {
            updates['engagementMeta.addProfileReminder'] = new Date().toISOString();
        }

        if (user.engageType === 'post') {
            updates['engagementMeta.addPostReminder'] = new Date().toISOString();
        }

        return User.findByIdAndUpdate(user._id, updates)
            .exec();
        
    });

    return Promise.all(pool)
        .then( () => {
            if (pool.length > 0) {
                console.log(`Updated ${pool.length} user records.`);
            }
            return users;
        });

}


/** save operation log to database
 *  @param     {array}   users     All inactive users
 *  @returns   {array}             All inactive users
*/
function saveLog(users) {

    const newLog = new Log({
        category : 'engagement_email',
        affectedUsers : users,
		actionTaken: 'dispatched_emails'
    });

    newLog.save( (err, result) => {
        if (err) { throw new Error(err); }
    });

    return users;
}


/** log some stats
 *  @param     {array}   users     All inactive users
*/
function logStats(users) {
    console.log(`
***************************************************
                      STATS
***************************************************
${users.length} users meet 'inactive' criteria...

${users.map( u => u._id + ' : ' + u.username + ' ( ' + u.email + ' ) ' + u.engageType).join('\n')}
    `);
}


/* =========================== EXPORT PUBLIC API =========================== */

module.exports = function() {
    
    // first, check logs. If last log.createAd = today, abort
    checkAlreadyRun()
        .then(okToProceed => {
            
            if (okToProceed) {
                getPostAuthors()
                    .then(getInactiveUsers)
                    .then(sendEmail)
                    .then(saveLog)
                    .then(updateUserRecords)
                    .then(logStats);
            } else {
                return Promise.reject('Too soon to send engagement emails');
            }
        
        })
        .catch(err => {
            console.log(err);
        });
    
};
