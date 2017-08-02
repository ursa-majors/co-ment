/* experimenting with more granular error handler */

module.exports = function (err, req, res, next) {
    
    console.log('Error\n', err);

    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid or missing token');
    } else {
        res.status(500).send('Something broke');  
    }

};
