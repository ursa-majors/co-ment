/*
   experimental until to conditionally email inactive users
*/

/* ================================= SETUP ================================= */

const User    = require('../models/user');
const Post    = require('../models/post');
const mailer  = require('./mailer');
const mailTpl = require('./mailtemplates').reminderTemplate;

/* =============================== UTILITIES =============================== */

/* determine eligibility of each user 
 * @params    [object]  user  [the user object from db ]
 * @returns   [boolean]       [true if conditions are met]
*/
function eligibleUsers(user) {

    let unSubbed         = user.contactMeta.unsubscribed;
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


/* Get inactive users
 * @params    [array]     postAuthors   [all unique post authors]
 * @returns   [Promise]                 [filtered list of inactive users]
*/
function getInactiveUsers(postAuthors) {

    return User.find()
        .exec()
        .then( users => users.filter(eligibleUsers) )
        .then( users => users.filter( u => {
            return postAuthors.indexOf(u._id.toString()) === -1;
        }));
}


/* Get list of all post authors
 * @params    [none]
 * @returns   [Promise]   [Promise object w/filtered list of post authors]
*/
function getPostAuthors() {

    return Post.find({})
        .exec()
        .then(makePostAuthorsArr);

}


/* Send email to applicable users
*/
function sendEmail(users) {
    
    let count = 0;
    
    const subject = 'co/ment - Hot sustainment injection dispatch!';
    const body    = {
        type: 'html',
        text: (mailTpl)
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
//    })

    console.log(`Sent ${count} reminder emails.`);
    
    return users;
}


/* log some stats
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


/**/
function handleErrors(err) {
    console.log(err);
}


/* =========================== EXPORT PUBLIC API =========================== */

module.exports = function emailInactiveUsers() {

    getPostAuthors()
        .then(getInactiveUsers)
        .then(sendEmail)
        .then(logStats)
        .catch(handleErrors);
};
