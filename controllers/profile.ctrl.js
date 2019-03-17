'use strict'

const User = require('../models/user')
const Post = require('../models/post')
const { parseSkill, errorWithStatus } = require('../utils')

/* ============================ ROUTE HANDLERS ============================= */

// GET ALL PROFILES
//   Example: GET >> /api/profiles
//   Secured: yes, valid JWT required.
//   Returns: an array of user profile objects on success
async function getProfiles (req, res, next) {
  const projection = { signupKey: 0, passwordResetKey: 0, hash: 0, salt: 0 }
  try {
    const profiles = await User.findAllUsers({ projection })
    return res.status(200).json(profiles)
  } catch (err) {
    return next(err)
  }
}

// GET ONE PROFILE
//   Example: GET >> /api/profile/597dccac7017890bd8d13cc7
//   Secured: yes, valid JWT required.
//   Expects:
//     1) '_id' from request params
//   Returns: user profile object on success
async function getOneProfile (req, res, next) {
  const projection = { signupKey: 0, passwordResetKey: 0, hash: 0, salt: 0 }
  const userId = req.params.id

  try {
    const profile = await User.findUserById({ userId, projection })
    if (!profile) {
      return res.status(404).json({ userId, message: `User profile not found` })
    }
    return res.status(200).json(profile)
  } catch (err) {
    return next(err)
  }
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
async function updateProfile (req, res, next) {
  // ensure user is allowed to update target user profile
  if (req.params.id !== req.token._id) {
    return next(errorWithStatus(new Error('Update profile not permitted'), 403))
  }

  const target = { _id: req.params.id, username: req.token.username }
  const updates = { ...req.body } // map only enumerable req.body properties
  const options = { new: true } // return updated document from mongodb

  // parse any skills
  if (updates.skills) {
    updates.skills = updates.skills.map(parseSkill)
  }

  try {
    const updatedProfile = await User.updateUser({ target, updates, options })
    if (!updatedProfile) {
      return next(errorWithStatus(new Error('Update error: user not found'), 404))
    }
    return res.status(200).json({ message: 'User updated!', user: updatedProfile })
  } catch (err) {
    return next(err)
  }
}

// DELETE A PROFILE
//   Example: DELETE >> /api/profile/597e3dca8167330add4be737
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from request params
//     2) '_id' from JWT
//     3) 'username' from JWT
//   Returns: success message & deleted user profile on success
async function deleteProfile (req, res, next) {
  // ensure user is allowed to update target user profile
  if (req.params.id !== req.token._id) {
    return next(errorWithStatus(new Error('Delete profile not permitted'), 403))
  }

  const targetUser = { _id: req.params.id, username: req.token.username }

  try {
    // first delete user's profile ...
    const deletedProfile = await User.deleteUser({ targetUser })
    if (!deletedProfile) {
      return next(errorWithStatus(new Error('Delete error: user not found'), 404))
    }
    // ... then set user's posts to 'deleted ...
    const didDeletePosts = await Post.deletePostsByAuthor({ authorId: targetUser._id })
    if (!didDeletePosts) {
      return next(errorWithStatus(new Error('Failed to delete posts'), 500))
    }
    // ... finally, handle delete success
    return res.status(200).json({
      message: 'User profile deleted!',
      user: deletedProfile
    })
  } catch (err) {
    return next(err)
  }
}

/* ================================ EXPORTS ================================ */

module.exports = {
  getProfiles,
  getOneProfile,
  updateProfile,
  deleteProfile
}
