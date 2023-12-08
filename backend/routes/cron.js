const Video = require('../models/Video');
const PopularVideo = require('../models/PopularVideo');
const User = require("../models/User");
// 매 시간마다 실행

const updatePopularVideo = async () => {
    try {
        const videos = await Video.find();
        const genderGroups = {
            male: [],
            female: [],
            other: []
        };

        for (const gender in genderGroups) {
            const sortedByGender = videos.sort((a, b) => b.genderViews[gender] - a.genderViews[gender]);
            genderGroups[gender] = sortedByGender.slice(0, Math.min(sortedByGender.length, 10));
        }
        const totalSort = videos.sort((a, b) => b.views - a.views);
        genderGroups["total"] = totalSort.slice(0, Math.min(totalSort.length, 10));

        let popularVideo = await PopularVideo.findOne();

        if (!popularVideo) {
            popularVideo = new PopularVideo({
                male: genderGroups.male,
                female: genderGroups.female,
                other: genderGroups.other,
                total:genderGroups.total
            });
        } else {
            popularVideo.male= genderGroups.male;
            popularVideo.female= genderGroups.female;
            popularVideo.other= genderGroups.other;
            popularVideo.total= genderGroups.total;
        }
        await popularVideo.save();
        console.log("Update popular videos");
    }catch (error) {
        console.error('Error generating popular videos:', error);
    }
};

const resetWeekAccessTimes = async () => {
    const users = await User.find();
    for(const user of users){
        user.weekAccessTimes=[];
        user.weekAccessTimes = Array(24).fill(0);
        await user.save();
    }
    console.log("Reset week access time");
};

module.exports = { resetWeekAccessTimes,updatePopularVideo };