/*
   functions to handle user profile retrieval, creation, update, and deletion
*/

/* ================================= SETUP ================================= */

const User = require('../models/user')
const Post = require('../models/post')
const parseSKill = require('../utils/skillsparser')
const projection = { signupKey: 0, passwordResetKey: 0, hash: 0, salt: 0 }

/* ============================ ROUTE HANDLERS ============================= */

// GET ALL PROFILES
//   Example: GET >> /api/profiles
//   Secured: yes, valid JWT required.
//   Returns: an array of user profile objects on success
//
function getProfiles (req, res) {
  User.find({}, projection)
    .exec()
    .then(profiles => res.status(200).json(profiles))
    .catch(err => {
      return res
        .status(400)
        .json({ message: err })
    })
}

// GET ONE PROFILE
//   Example: GET >> /api/profile/597dccac7017890bd8d13cc7
//   Secured: yes, valid JWT required.
//   Expects:
//     1) '_id' from request params
//   Returns: user profile object on success
//
function getOneProfile (req, res) {
  const target = req.params.id

  User.findOne({ _id: target }, projection, (err, profile) => {
    if (!profile) {
      return res
        .status(404)
        .json({ message: 'User profile not found!' })
    }

    return res
      .status(200)
      .json(profile)
  })
}

// UPDATE PROFILE
//   Example: PUT >> /api/profile/597dccac7017890bd8d13cc7
//   Secured: yes, valid JWT required.
//   Expects:
//     1) 'username' from JWT token
//     2) '_id' from request params
//     3) optional request body properties : {
//          name       : String
//          email      : String
//          avatarUrl  : String
//          languages  : Array
//          location   : String
//          gender     : String
//          about      : String
//          skills     : Array
//          time_zone  : String
//          github     : String
//          twitter    : String
//          facebook   : String
//          link       : String
//          linkedin   : String
//          codepen    : String
//        }
//   Returns: success message & updated profile object on success
//
function updateProfile (req, res) {
  const target = {
    _id: req.params.id,
    username: req.token.username
  }

  // kick off promise chain
  new Promise((resolve, reject) => {
    // make sure the requesting user ID and target user ID match
    if (target._id === req.token._id) {
      resolve(target)
    } else {
      reject('Error: user ID mismatch.')
    }
  })
    .then(() => {
      // map enumerable req body properties to updates object
      const updates = Object.assign({}, req.body)

      // parse skills array if update includes skills
      if (updates.skills) {
        updates.skills = (updates.skills).map(skill => parseSKill(skill))
      }

      const options = {
        new: true // return updated document rather than the original
      }

      User.findOneAndUpdate(target, updates, options)
        .exec()
        .then(user => {
          if (!user) {
            return res
              .status(404)
              .json({ message: 'User not found!' })
          } else {
            return res
              .status(200)
              .json({
                message: 'User updated!',
                user: user
              })
          }
        })
    })
    .catch(err => {
      console.log('Error!!!', err)
      return res
        .status(400)
        .json({ message: err })
    })
}

// DELETE A PROFILE
//   Example: DELETE >> /api/profile/597e3dca8167330add4be737
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from request params
//     2) '_id' from JWT
//     3) 'username' from JWT
//   Returns: success message & deleted user profile on success
//
function deleteProfile (req, res) {
  const targetUser = {
    _id: req.params.id,
    username: req.token.username
  }

  // make sure the requesting user ID and target user ID match
  if (targetUser._id !== req.token._id) {
    return res
      .status(400)
      .json({ message: 'Error: user ID mismatch.' })
  }

  User.findOneAndRemove(targetUser)
    .exec()
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .json({ message: 'User not found!' })
      } else {
        const postAuthor = {
          author_id: targetUser._id,
          author: targetUser.username
        }

        const updates = {
          deleted: true,
          active: false
        }

        const options = {
          multi: true
        }

        // "delete" all posts from same author. Sets "deleted" to true,
        // and "active" to false
        Post.update(postAuthor, updates, options, (err, raw) => {
          if (err) { throw err } else {
            console.log('The raw response from Mongo was ', raw)

            return res
              .status(200)
              .json({
                message: 'User profile deleted!',
                user: user
              })
          }
        })
      }
    })
    .catch(err => {
      console.log('Error!!!', err)
      return res
        .status(400)
        .json({ message: err })
    })
}

// REFRESH USER TOKEN
//   Example: GET >> /api/refresh_token
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT
//   Returns: user profile and new JWT on success
//
function refreshToken (req, res) {
  const userId = req.token._id

  User.findById(userId)
    .exec()
    .then(user => {
      // generate a token
      const token = user.generateJWT()

      // return the user profile & JWT
      return res
        .status(200)
        .json({
          profile: user,
          token: token
        })
    })
    .catch(err => {
      console.log('Error!!!', err)
      return res
        .status(400)
        .json({ message: err })
    })
}

/* ============================== EXPORT API =============================== */

module.exports = {
  getProfiles,
  getOneProfile,
  updateProfile,
  deleteProfile,
  refreshToken
}
