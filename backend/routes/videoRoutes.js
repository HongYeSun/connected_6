const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const errorMessages = require('./errorMessages');



//좋아요 버튼
router.post('/like/:videoId', isLoggedIn, async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id; // 로그인한 사용자의 ID

        const video = await Video.findById(videoId);
        const user = await User.findById(userId);
        let ageIdx = Math.floor(user.age / 10);

        if(ageIdx>7)
            ageIdx=7;
        const gender=await user.gender;

        // 비디오가 없는 경우
        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }

        // 사용자가 이미 좋아요를 한 경우 (좋아요 취소)
        if (user.likedVideos.includes(videoId)) {
            // 비디오의 좋아요 수 감소 및 사용자 likedVideos에서 제거
            if(video.like>0)
                video.like -= 1;
            if(video.ageLikes[ageIdx]>0)
                video.ageLikes[ageIdx]-=1;
            if(video.genderLikes[gender]>0)
                video.genderLikes[gender]-=1;
            user.likedVideos = user.likedVideos.filter((id) => id.toString() !== videoId);
        } else {
            // 기존에 좋아요를 하지 않은 경우
            video.like += 1;
            video.ageLikes[ageIdx]+=1;
            video.genderLikes[gender]+=1;
            user.likedVideos.push(videoId);
        }

        await video.save();
        await user.save();

        return res.status(200).json({ video, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: '에러가 발생했습니다.' });
    }
});

router.post('/bookmark/:videoId', isLoggedIn, async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id; // 로그인한 사용자의 ID

        const video = await Video.findById(videoId);
        const user = await User.findById(userId);

        // 비디오가 없는 경우
        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }
        //북마크 이미 한 경우
        if (user.bookmarkedVideos.includes(videoId)) {
            if(video.bookmark>0)
                video.bookmark -= 1;
            user.bookmarkedVideos = user.bookmarkedVideos.filter((id) => id.toString() !== videoId);
        } else {
            // 기존에 좋아요를 하지 않은 경우
            video.bookmark += 1;
            user.bookmarkedVideos.push(videoId);
        }

        await video.save();
        await user.save();

        return res.status(200).json({ video, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.error });
    }
});

//TODO: 이건 동영상 화면에 들어온거니까 최근 본 동영상 배열에 추가해야 함!
router.get('/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }

        return res.status(200).json({ video });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.error});
    }
});

//post new video
router.post('/',  async (req, res) => {
    try {
    const { title, subtitle, description, thumb, source } = req.body;

    const newVideo = new Video({
        title,
        subtitle,
        description,
        thumb,
        source
    });
    newVideo.ageLikes = Array(8).fill(0);
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//1. 인기동영상을 요청 들어올때마다(좋아요 버튼 누르기 등) 업데이트 vs node-cron으로 12시간 주기로 업데이트
// node-cron

//2.
//프론트: 현재 00초부터 재생(추후 논의)


module.exports = router;









module.exports = router;