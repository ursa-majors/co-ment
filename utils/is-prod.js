'use strict'

const PROD_ENVS = Object.freeze([
  'production',
  'prod'
])

module.exports = (env) => PROD_ENVS.includes(env)
