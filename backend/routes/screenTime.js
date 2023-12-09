const User = require('../models/User');
const errorMessages = require('./errorMessages');

const dayjs = require('dayjs');

function isSameDate(date1, date2) {
    return dayjs(date1).isSame(dayjs(date2),'hour');

}

//Update accessTimes, lastRequestTime, weekAccessTimes
async function updateAccessTimes(user) {
    try {
        const savedUser = await User.findById(user._id);
        const lastRequestTime = savedUser.lastRequestTime;

        const currentRequestTime = dayjs().tz();

        if (!isSameDate(lastRequestTime, currentRequestTime)) {
            const hour = currentRequestTime.get("h");

            savedUser.accessTimes[hour]++;
            savedUser.weekAccessTimes[hour]++;
            await savedUser.save();
        }

        savedUser.lastRequestTime = currentRequestTime.toDate();

        await savedUser.save();
    } catch (error) {
        console.error(error);
        throw new Error(errorMessages.updateTimeError);
    }
}


module.exports = { updateAccessTimes };

