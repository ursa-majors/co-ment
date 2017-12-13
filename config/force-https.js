/*
    Middleware to force / redirect to https connections
*/

module.exports = function (req, res, next) {

    if (req.headers['x-forwarded-proto'].match(/https/g)) {
        // Secure protocol, continue as normal
        return next();
    }

    res.redirect(302, `https://${req.hostname}${req.url}`);

};
