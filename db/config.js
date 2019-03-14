'use strict'

require('dotenv').config()
const dbUname = process.env.DB_UNAME
const dbPwd = process.env.DB_PWD

exports = module.exports = Object.freeze({
  development: {
    url: `mongodb://127.0.0.1:27017`,
    dbName: 'co-ment-dev',
    options: { useNewUrlParser: true }
  },
  testing: {
    url: `mongodb://${dbUname}:${dbPwd}@ds161503.mlab.com:61503`,
    dbName: 'co-ment-test',
    options: { useNewUrlParser: true }
  },
  production: {
    url: `mongodb://${dbUname}:${dbPwd}@ds127983.mlab.com:27983`,
    dbName: 'co-ment',
    options: { useNewUrlParser: true }
  }
})
