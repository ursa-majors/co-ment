'use strict'

// Checks wheather user has validated their account.
// If `validated: false`, bail out early.
exports = module.exports = (req, res, next) => {
  if (!req.token.validated) {
    const validatedErrMsg = `
      You need to validate your account before you can access this resource.
      Please visit your Profile and generate a new validation email.
    `
    req.log.error({ req }, 'Unauthorized')
    return res.status(403).json({ message: validatedErrMsg })
  }
  return next()
}
