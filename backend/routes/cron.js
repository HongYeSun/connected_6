const cron = require('node-cron');
const User = require('../models/User');

// 활동 중인 사용자 목록
const activeUsers = [];
// 매 시간마다 실행
cron.schedule('0 * * * *', async () => { //TODO: 크론탭 등록하기
    try {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        //활동 중인 사용자만 체크

        for (const user of activeUsers) {

            if (currentHour < 24) { //idx:0~23
                user.accessTimes[currentHour]++;
                await user.save();
            }
        }
    } catch (error) {
        console.error(error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Seoul', // 시간대 설정
});
module.exports = {activeUsers,cron};