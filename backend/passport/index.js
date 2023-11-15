const passport = require("passport");
const User = require("../models/User");
const local = require("./local");


module.exports = () => {
    // Serialize
    passport.serializeUser((user, done) => {

        return done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({
                _id:id });

            if (user) return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }

    });
    //localStrategy
    local();
};