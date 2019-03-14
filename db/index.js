'use strict'

const environment = process.env.NODE_ENV || 'development'
const config = require('./config')[environment]

exports = module.exports = Object.freeze({
  getConnectionString: () => `${config.url}/${config.dbName}`,
  getConnectionOptions: () => config.options
})
