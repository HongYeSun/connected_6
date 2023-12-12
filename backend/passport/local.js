const passport = require('passport');
const bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/User');
const errorMessages = require('../routes/errorMessages');

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne(
                        { email: email } //email:unique
                    );
                    if (!user) {
                        return done(null, false, {
                            reason: errorMessages.emailError
                        });
                    }

                    const result = await bcrypt.compare(password, user.password);

                    if (result) return done(null, user);
                    else return done(null, false, {
                        reason: errorMessages.passwordError
                    }
                    );
                } catch (e) {
                    console.error(e);
                    return done(e);
                }
            }));
}