const User = require('../models/User');
const errorMessages = require('./errorMessages');

function getKoreanTime(){
    const offset = 1000 * 60 * 60 * 9;
    return new Date((new Date()).getTime() + offset);
}
function isSameDate(date1, date2) {
    const dt1=new Date(date1);
    const dt2=new Date(date2);
    return (
        dt1.getFullYear() === dt2.getFullYear() &&
        dt1.getMonth() === dt2.getMonth() &&
        dt1.getDate() === dt2.getDate()&&
        dt1.getHours()===dt2.getHours()
    );
}

//Update accessTimes, lastRequestTime, todayAccessTimes
async function updateAccessTimes(user) {
    try {
        const savedUser = await User.findById(user._id);
        const lastRequestTime = savedUser.lastRequestTime;
        const currentRequestTime = getKoreanTime();

        if (!isSameDate(lastRequestTime, currentRequestTime)) {
            const hour = new Date(currentRequestTime).getHours();
            savedUser.accessTimes[hour]++;
            await savedUser.save();
        }
        savedUser.lastRequestTime = currentRequestTime;
        await savedUser.save();
    } catch (error) {
        console.error(error);
        throw new Error(errorMessages.updateTimeError);
    }
}

module.exports = { getKoreanTime,updateAccessTimes };
