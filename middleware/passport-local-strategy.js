'use strict'

// auth strategy passport middleware
exports = module.exports = (LocalStrategy, User) => {
  return new LocalStrategy((username, password, done) => {
    User.findOne(
      // query - find by username
      { username: username },
      // projection - select fields to return
      'username salt hash',
      // callback - gets error & result of query
      (err, user) => {
        // denial
        if (err) {
          return done(err)
        }

        // anger
        if (!user) {
          return done(null, false, { message: 'Invalid User Name' })
        }

        // bargaining
        if (!user.validatePassword(password)) {
          return done(null, false, { message: 'Invalid Password' })
        }

        // acceptance!
        return done(null, user)
      })
  })
}
