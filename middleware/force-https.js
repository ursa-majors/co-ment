'use strict'

const isProd = require('../utils/is-prod')

// helpers

function getForwardedProtoHeader (obj, rex) {
    const property = Object.entries(obj).find(([key]) => key.match(rex))
    return property && property[1]
}

// main

/**
 * Make middleware to conditionally redirect to https protocol in prod envs
 * @param    {String}    env  Value of process.env.NODE_ENV
 * @returns  {Function}
 */
const makeForceHttpsMiddleware = (env) => (req, res, next) => {
    if (isProd(env)) {
        // match on various header spellings. For ex:
        //   'x-forwarded-proto', 'X-Forwarded-Protocol'
        const regex = /^x-forwarded-proto(col)?$/i

        const xForwardedProto = getForwardedProtoHeader(req.headers, regex)
        if (xForwardedProto == null) {
            return next(new Error('Missing X-Forwarded-Protocol header'))
        }

        if (xForwardedProto.match(/https/g)) {
            // Secure protocol, continue as normal
            return next()
        }

        // else redirect
        return res.redirect(302, `https://${req.hostname}${req.url}`)
    } else {
        return next()
    }
    
};

module.exports = makeForceHttpsMiddleware
