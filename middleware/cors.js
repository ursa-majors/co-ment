/*
    CORS middleware
*/

module.exports = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    // intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        // respond with 200
        res.sendStatus(200);
    } else {
        next();
    }
};