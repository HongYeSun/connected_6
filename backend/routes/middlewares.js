const errorMessages = require('./errorMessages');

exports.isLoggedIn = (req, res, next)=>{

    if (req.user) {
        next();
    } else {
        res.status(403).send(errorMessages.loginRequired)
    }
}

exports.isNotLoggedIn = (req, res, next) =>{
    if(!req.user){
        next();
    } else{
        res.status(403).send(errorMessages.alreadyLoggedin)
    }
}

