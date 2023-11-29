const errorMessages = require('./errorMessages');

exports.isLoggedIn = (req, res, next)=>{

    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send(errorMessages.loginRequired)
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('User is not logged in, proceeding with the request');
        next();
    } else {
        console.log('User is already logged in, blocking the request');
        res.status(403).send(errorMessages.alreadyLoggedin);
    }
};