exports.isLoggedIn = (req, res, next)=>{

    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인이 필요합니다.')
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('User is not logged in, proceeding with the request');
        next();
    } else {
        console.log('User is already logged in, blocking the request');
        res.status(403).send('이미 로그인한 상태입니다.');
    }
};