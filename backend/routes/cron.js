const Video = require('../models/Video');
const PopularVideo = require('../models/PopularVideo');
const User = require("../models/User");
// 매 시간마다 실행
const updatePopularVideo = async () => {
    try {

        const videos = await Video.find();
        const ageGroups = Array(8).fill([]);

        const genderGroups = {
            male: [],
            female: [],
            other: []
        };

        for(let i = 0; i < 8; i++){
            const sortedByAge = videos.sort((a, b) => b.ageLikes[i] - a.ageLikes[i]);
            ageGroups[i] = sortedByAge.slice(0, Math.min(sortedByAge.length, 10));
        }

        for (const gender in genderGroups) {
            const sortedByGender = videos.sort((a, b) => b.genderLikes[gender] - a.genderLikes[gender]);
            genderGroups[gender] = sortedByGender.slice(0, Math.min(sortedByGender.length, 10));
        }

        let popularVideo = await PopularVideo.findOne();

        if (!popularVideo) {
            popularVideo = new PopularVideo({
                byAge: ageGroups,
                byGender: genderGroups
            });
        } else {
            popularVideo.byAge = ageGroups;
            popularVideo.byGender = genderGroups;
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
    }

};

module.exports = { resetWeekAccessTimes,updatePopularVideo };