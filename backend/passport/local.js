const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User');

module.exports = () => {
    passport.use(

        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    console.log(email);
                    console.log(password);
                    const user = await User.findOne(
                        { email: email }
                    );
                    if (!user) {
                        return done(null, false, {
                            reason: '존재하지 않는 계정입니다.'
                        });
                    }

                    const result = await bcrypt.compare(password, user.password);
                    if (result) return done(null, user);
                    else return done(null, false, {
                        reason: "잘못된 비밀번호입니다."
                    });
                } catch (e) {
                    console.error(e);
                    return done(e);
                }
            }));
}