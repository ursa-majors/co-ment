'use strict'

const passport = require('passport')
const User = require('../models/user')
const { errorWithStatus } = require('../utils')
const mailer = require('../utils/mailer')
const emailTpl = require('../utils/mailtemplates')
const mailUtils = require('../utils/mailutils')

/* =============================== UTILITIES =============================== */

/**
 * Dispatch new user validation email
 * @param   {string}  key       randomly generated key
 * @param   {string}  toEmail   user/recipient email address
 * @param   {string}  toUserId  new user's _id
 */
function sendValidationEmail ({ key, toEmail, toUserId }) {
  const url = mailUtils.makeValidationUrl(toUserId, key)
  const subject = 'co/ment - Email verification required'
  const body = {
    type: 'html',
    text: emailTpl.validationTemplate(url, toUserId)
  }

  try {
    mailer(toEmail, subject, body)
    console.log('Email validation sent successfully.')
  } catch (err) {
    console.log(`Error: $(err)`)
  }
}

/**
 * Dispatch new password reset email
 * @param   {string}   key         randomly generated key
 * @param   {string}   toEmail    user/recipient email address
 * @param   {string}   recUserId  user/recipient _id
 */
function sendPWResetEmail ({ key, toEmail, recUserId }) {
  console.log('pwreset', { key, toEmail, recUserId })
  const url = `https://co-ment.glitch.me/resetpassword/${key}`
  const subject = 'co/ment - Password Reset Request'
  const body = {
    type: 'html',
    text: emailTpl.pwResetTemplate(url, recUserId)
  }

  try {
    mailer(toEmail, subject, body)
    console.log('Email validation sent successfully.')
  } catch (err) {
    console.log(`Error: $(err)`)
  }
}

/* ============================ ROUTE HANDLERS ============================= */

// REFRESH USER TOKEN
//   Example: GET >> /api/refresh_token
//   Secured: yes, valid JWT required
//   Expects:
//     1) '_id' from JWT
//   Returns: user profile and new JWT on success
async function refreshToken (req, res, next) {
  try {
    const user = await User.findUserById({ userId: req.token._id })
    if (!user) {
      return next(errorWithStatus(new Error('User not found'), 404))
    }
    const token = user.generateJWT()
    return res.status(200).json({ profile: user, token })
  } catch (err) {
    return next(err)
  }
}

// NEW_USER REGISTRATION
// Dispatches new user validation email
//   Example: POST >> /api/register
//   Secured: no
//   Expects:
//     1) request body properties : {
//          username : String
//          password : String
//          email    : String
//        }
//   Returns: user profile object & JWT on success
async function register (req, res, next) {
  // ensure required inputs exist
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json({ 'message': 'Please complete all required fields.' })
  }

  const target = {
    $or: [{ username: req.body.username }, { email: req.body.email }]
  }

  try {
    const user = await User.findOne(target).exec()
    // finding a user means user already exists
    if (user && user.username === req.body.username) {
      throw errorWithStatus(new Error('Username already taken'), 400)
    }
    if (user && user.email === req.body.email) {
      throw errorWithStatus(new Error('Email already registered'), 400)
    }
    // no user found; make a new one
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      validated: false,
      signupKey: mailUtils.makeSignupKey()
    })

    newUser.hashPassword(req.body.password)

    // save new user to database
    const savedUser = await newUser.save()

    // build filtered user profile for later response
    const profile = {
      username: savedUser.username,
      email: savedUser.email,
      validated: savedUser.validated,
      _id: savedUser._id
    }

    // build email parameter map
    const emailParams = {
      key: savedUser.signupKey.key,
      toEmail: savedUser.email,
      toUserId: savedUser._id
    }

    // send validation email, passing email param map
    sendValidationEmail(emailParams)

    // generate auth token
    const token = savedUser.generateJWT()

    // respond with profile & JWT
    return res.status(200).json({ profile, token })
  } catch (err) {
    return next(err)
  }
}

// HANDLE EMAIL VALIDATION LINKS
// Toggles user's `validated` property to `true`
//   Example: GET >> /api/validate
//   Secured: no
//   Expects:
//     1) request query params
//        * uid : String
//        * key : String
//   Returns: redirect to client-side validation landing page
async function validate (req, res, next) {
  const { uid, key } = req.query
  const target = { _id: uid }
  const updates = { validated: true }

  try {
    const updatedUser = await User.updateUser({ target, updates })
    if (!updatedUser) {
      throw errorWithStatus(new Error('No user with that ID found'), 404)
    }

    if (updatedUser.signupKey.key !== key) {
      throw errorWithStatus(new Error('Registration key mismatch'), 400)
    }

    // redirect to client-side validation landing page
    return res.redirect(302, '/#/redirect=validate')
  } catch (err) {
    return next(err)
  }
}

// LOGIN
//   Example: POST >> /api/login
//   Secured: no
//   Expects:
//     1) request body params : {
//          username : String
//          password : String
//        }
//   Returns: success status, user profile & JWT on success
//
async function login (req, res, next) {
  // ensure required inputs exist
  const { username, password } = req.body
  if (!username) return next(errorWithStatus(new Error('Missing required username')), 400)
  if (!password) return next(errorWithStatus(new Error('Missing required password')), 400)

  passport.authenticate('local', async (err, user, info) => {
    if (err) { return next(err) }

    // if auth failed, there will be no user - fail
    if (!user) {
      return res.status(401).json(info)
    }

    try {
      const projection = { hash: 0, salt: 0, signupKey: 0 }
      const profile = await User.findUserById({ userId: user._id, projection })
      if (!profile) throw errorWithStatus(new Error('User not found'), 404)
      // generate JWT and respond
      const token = profile.generateJWT()
      return res.status(200).json({ profile, token })
    } catch (err) {
      return next(err)
    }
  })(req, res, next)
}

// SEND PW RESET EMAIL
// Dispatches password reset email
//   Example: POST >> /api/sendresetemail
//   Secured: no
//   Expects:
//     1) request body params : {
//          username : String
//        }
//   Returns: success status & message on success
async function sendReset (req, res, next) {
  // generate reset key
  const { username } = req.body
  if (!username) return next(errorWithStatus(new Error('Missing required username')), 400)
  const resetKey = mailUtils.makeSignupKey()

  try {
    const user = await User.findOne({ username }).exec()
    if (!user) throw errorWithStatus(new Error('No user with that username'), 404)
    // store password reset key on user
    user.passwordResetKey = resetKey
    await user.save()

    const emailParams = {
      key: user.passwordResetKey.key,
      toEmail: user.email,
      recUserId: user._id
    }

    // send password reset email
    sendPWResetEmail(emailParams)

    return res.status(200).json({ message: 'Password Reset email sent' })
  } catch (err) {
    return next(err)
  }
}

// RESET PASSWORD
//   Example: POST >> /api/resetpassword
//   Secured: no
//   Expects:
//     1) request body params : {
//          username : String
//          password : String
//          key      : String
//        }
//   Returns: success status & message on success
async function resetPass (req, res, next) {
  const { username, password, key } = req.body
  if (!username) return next(errorWithStatus(new Error('Missing required username')), 400)
  if (!password) return next(errorWithStatus(new Error('Missing required password')), 400)
  if (!key) return next(errorWithStatus(new Error('Missing required key')), 400)

  try {
    const user = await User.findOne({ username }).exec()
    if (!user) {
      throw errorWithStatus(new Error('No user with that username'), 404)
    }
    if (user.passwordResetKey.key !== key) {
      throw errorWithStatus(new Error('Invalid password reset key'), 400)
    }

    // reset password, clear the key, save the user
    user.hashPassword(password)
    user.passwordResetKey = {}
    await user.save()

    return res.status(200).json({ message: 'Password reset successful' })
  } catch (err) {
    return next(err)
  }
}

/* ================================ EXPORTS ================================ */

exports = module.exports = {
  refreshToken,
  register,
  validate,
  login,
  sendReset,
  resetPass
}
