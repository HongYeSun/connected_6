const passport = require("passport");
const User = require("../models/User");
const local = require("./local");


module.exports = () => {
    // Serialize
    passport.serializeUser((user, done) => {
        console.log("serialize");
        console.log(user.id);
        return done(null, user.id);
    });
    //TODO:여기서 user못찾는중
    passport.deserializeUser(async (id, done) => {
        console.log("deserialize");
        console.log(id);
        try {
            const user = await User.findOne({
                _id:id });
            console.log(user);
            if (user) return done(null, user);
        } catch (e) {
            console.error(e);
            return done(e);
        }

    });
    //localStrategy
    local();
};