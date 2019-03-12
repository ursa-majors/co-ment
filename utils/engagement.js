/*
   User engagement email utility
*/

/* ================================= SETUP ================================= */

const User = require('../models/user')
const Post = require('../models/post')
const Log = require('../models/log')
const mailer = require('./mailer')
const { engagementTpl } = require('./mailtemplates')

/* =============================== UTILITIES =============================== */

/* determine basic eligibility of each user
   Checks:
     user.createdAt (Date) - if > 1 week ago, user is eligible
     contactMeta.unSubbed (Boolean) - if 'false', user is eligible
 * @params    [object]     user  [the user object from db ]
 * @returns   [boolean]          [true if user is eligible for email]
*/
function basicEligibility (user) {
  let unSubbed = user.contactMeta.unSubbed
  let createdInMs = new Date(user.createdAt).getTime()
  let weekInMs = 7 * 24 * 60 * 60 * 1000
  let tooSoon = createdInMs + weekInMs > Date.now()

  // if user has unSubbed or it's too soon, user is not eligible
  return !((unSubbed || tooSoon))
}

/* determine what type of engagement email to send eligibile user
   Checks for existence of `user.name`, a required field when updating
   a user profile.
 * @params    [object]    user   [the user object from db ]
 * @returns   [object]           [user object w/property 'engageType']
*/
function addEligibilityType (user) {
  if (!user.name) {
    user.engageType = 'profile'
  } else {
    user.engageType = 'post'
  }

  return user
}

/* map/reduce posts to array of unique authors
 * @params    [array]   posts  [array of post objects from db ]
 * @returns   [array]          [array of unique post author '_id's]
*/
function makePostAuthorsArr (posts) {
  const uniques = {}

  return posts
    .map(post => post.author_id)
    .sort((a, b) => a - b)
    .reduce((list, curr) => {
      if (!uniques[curr]) {
        uniques[curr] = 1
        list.push(curr)
      }
      return list
    }, [])
}

/* ============================ PRIVATE METHODS ============================ */

/** Check db logs for previous engagement run today
 *  @returns   [Promise]      [Promise object with Boolean payload]
*/
function checkAlreadyRun () {
  return Log.find()
    .sort({ 'createdAt': -1 })
    .limit(1)
    .exec()
    .then(log => {
      if (log.length === 0) { return true }

      let lastLogDate = Math.floor(Date.parse(log[0].createdAt) / 1000)
      let today = Math.floor(Date.now() / 1000)
      let oneDay = 86400

      console.log('Last log taken: ', log[0].createdAt)

      return (today > lastLogDate + 86400)
    })
}

/** Get inactive users
 * Finds all users, then filters for users who have NOT authored posts.
 * @param     [array]     postAuthors   [all unique post authors]
 * @returns   [Promise]                 [Promise w/array of inactive users]
*/
function getInactiveUsers (postAuthors) {
  const projection = {
    _id: 1,
    username: 1,
    name: 1,
    email: 1,
    contactMeta: 1,
    engagementMeta: 1
  }

  return User.find({}, projection)
    .exec()

  // filter for basic elegibility
    .then(users => users.filter(basicEligibility))

  // filter for only users who haven't authored posts
    .then(users => users.filter(u => {
      return postAuthors.indexOf(u._id.toString()) === -1
    }))

  // from this ^ subset, determine what type of engagement email to send
    .then(users => users.map(addEligibilityType))
}

/** Get list of all post authors
 * @returns   [Promise]   [Promise object w/filtered list of post authors]
*/
function getPostAuthors () {
  return Post.find({})
    .exec()
    .then(makePostAuthorsArr)
}

/** Send email to applicable users
 * @param     [array]     users   [all inactive users]
 * @returns   [array]             [all emailed users]
*/
function sendEmail (users) {
  const pool = users.map(user => {
    let subject = 'co/ment - Operation: User Engagement!'
    let body = {
      type: 'html',
      text: engagementTpl(user.engageType)
    }

    return new Promise((resolve, reject) => {
      try {
        mailer(user.email, subject, body)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  })

  return Promise.all(pool)
    .then(() => {
      console.log(`Sent ${pool.length} reminder emails.`)
      return users
    })
}

/** save operation log to database
 * @param     [array]   users     [all inactive users]
 * @returns   [array]             [all inactive users]
*/
function saveLog (users) {
  const newLog = new Log({
    category: 'engagement_email',
    affectedUsers: users,
    actionTaken: 'dispatched_emails'
  })

  newLog.save((err, result) => {
    if (err) { throw new Error(err) }
  })

  return users
}

/** log some stats
 * @param   [array]   users   [all inactive users]
*/
function logStats (users) {
  console.log(`
***************************************************
                      STATS
***************************************************
${users.length} users meet 'inactive' criteria:

${users.map(u => u._id + ' ( ' + u.username + ' )').join('\n')}
    `)
}

/* =========================== EXPORT PUBLIC API =========================== */

module.exports = function () {
  // first, check logs. If last log.createAd = today, abort
  checkAlreadyRun()
    .then(result => {
      if (result === true) {
        getPostAuthors()
          .then(getInactiveUsers)
          .then(sendEmail)
          .then(saveLog)
          .then(logStats)
      } else {
        return Promise.reject('Too soon to send engagement emails')
      }
    })
    .catch(err => {
      console.log(err)
    })
}
