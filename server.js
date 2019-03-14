'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const compression = require('compression')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')

const { getConnectionString, getConnectionOptions } = require('./db')
const User = require('./models/user')

const {
  requestMiddleware,
  loggerMiddleware,
  errorMiddleware,
  corsMiddleware,
  forceHttpsMiddleware,
  passportLocalStrategy
} = require('./middleware')

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(forceHttpsMiddleware(process.env.NODE_ENV === 'production'))
app.use(loggerMiddleware())
app.use(requestMiddleware())
app.use(compression())
app.use(corsMiddleware())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/client/build/')))
app.use(passport.initialize())
passport.use(passportLocalStrategy(LocalStrategy, User))

// routes
app.use('/auth', require('./routes/authroutes'))
app.use('/api', require('./routes/apiroutes'))
app.use('/', require('./routes/staticroutes'))

// catch-all error handler
app.use(errorMiddleware())

// connect to db and startup
mongoose.connect(getConnectionString(), getConnectionOptions())
  .then(() => {
    console.log(`Connected to ${getConnectionString()}`)
    app.listen(PORT, () => console.log('Server listening on port:', PORT))
  })
  .catch((err) => {
    console.log(err.message)
    process.exit(1)
  })
