const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const errorMessages = require('./errorMessages');
const {updateAccessTimes} =require('./screenTime');


//좋아요 버튼
router.post('/like/:videoId', isLoggedIn, async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id; // 로그인한 사용자의 ID

        const video = await Video.findById(videoId);
        const user = await User.findById(userId);
        let ageIdx = Math.floor(user.age / 10);
        let flag;
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
            flag=false;
        } else {
            // 기존에 좋아요를 하지 않은 경우
            video.like += 1;
            video.ageLikes[ageIdx]+=1;
            video.genderLikes[gender]+=1;
            user.likedVideos.push(videoId);
            flag=true;
        }
        await updateAccessTimes(user);
        await video.save();
        await user.save();
        const videoLike=video.like;

        return res.status(200).json({ flag, videoLike });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.error });
    }
});

router.post('/bookmark/:videoId', isLoggedIn, async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user._id; // 로그인한 사용자의 ID

        const video = await Video.findById(videoId);
        const user = await User.findById(userId);
        let flag;
        // 비디오가 없는 경우
        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }
        //북마크 이미 한 경우
        if (user.bookmarkedVideos.includes(videoId)) {
            if(video.bookmark>0)
                video.bookmark -= 1;
            user.bookmarkedVideos = user.bookmarkedVideos.filter((id) => id.toString() !== videoId);
            flag=false;
        } else {
            // 기존에 좋아요를 하지 않은 경우
            video.bookmark += 1;
            user.bookmarkedVideos.push(videoId);
            flag=true;
        }
        await updateAccessTimes(user);
        await video.save();
        await user.save();
        const videoBookmark=video.bookmark;


        return res.status(200).json({ flag,videoBookmark });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.error });
    }
});

//TODO: 최근 본 비디오 배열에 추가
router.get('/:videoId', isLoggedIn,async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        const userId = req.user._id; // 로그인한 사용자의 ID
        const user = await User.findById(userId);

        await updateAccessTimes(user);
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

//Get all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//2.
//프론트: 현재 00초부터 재생(추후 논의)

//TODO: 앞으로 해야할거: 이어보기 구현
module.exports = router;

