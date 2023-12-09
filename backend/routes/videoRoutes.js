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
        let flag;

        // 비디오가 없는 경우
        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }

        // 사용자가 이미 좋아요를 한 경우 (좋아요 취소)
        if (user.likedVideos.includes(videoId)) {
            // 비디오의 좋아요 수 감소 및 사용자 likedVideos에서 제거
            if(video.like>0)
                video.like -= 1;
            user.likedVideos = user.likedVideos.filter((id) => id.toString() !== videoId);
            flag=false;
        } else {
            // 기존에 좋아요를 하지 않은 경우
            video.like += 1;
            user.likedVideos.unshift(videoId);
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
            user.bookmarkedVideos.unshift(videoId);

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
router.post('/fetch-videos', async (req, res) => {
    try {
        const videoIds = req.body.videoIds;
        const videoIdsArray = videoIds.map(video => video.video); // Extracting video IDs from the array

        const videos = await Video.find({ '_id': { $in: videoIdsArray } });
      //  console.log(videoIds, videos);
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:videoId', isLoggedIn,async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        const userId = req.user._id; // 로그인한 사용자의 ID
        const user = await User.findById(userId);
        const gender=user.gender;

        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }


        let foundIndex=-1;
        if(user.recentVideos.length) {
            foundIndex = user.recentVideos.findIndex((recentVideo) => recentVideo.video.toString() === videoId)
        }
        let lastWatchedTime = 0; // 초 초기값

        if (foundIndex !== -1) {

            lastWatchedTime = user.recentVideos[foundIndex].lastWatched;
            user.recentVideos.splice(foundIndex, 1); // 기존 항목 제거
        }
        user.recentVideos.unshift({ video: videoId, lastWatched: lastWatchedTime });


        video.genderViews[gender]++;
        video.views++;
        await updateAccessTimes(user);
        await user.save();
        await video.save();
        return res.status(200).json({ video, "lastWatched":lastWatchedTime});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.error});
    }
});

//다 보고나서 화면 나갈때 lastwatched 업데이트 (last watched는 json으로 받았다고 가정)
router.post('/:videoId', isLoggedIn,async (req, res) => {
    try {
        const { videoId } = req.params;
        const { lastWatched }= req.body;
        //console.log(req.body);
        const video = await Video.findById(videoId);
        const userId = req.user._id; // 로그인한 사용자의 ID
        const user = await User.findById(userId);

        if (!video) {
            return res.status(404).json({ message: errorMessages.videoNotFound });
        }
        const foundIndex = user.recentVideos.findIndex(
            (recentVideo) => recentVideo.video.toString() === videoId
        );

        if (foundIndex !== -1) {
            user.recentVideos[foundIndex].lastWatched = lastWatched;
        }
       // console.log(lastWatched,foundIndex);
        await updateAccessTimes(user);
        await user.save();
        return res.status(200).json({ message: errorMessages.lastWatchedSuccess});

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
        const videos = await Video.find().sort({ _id: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;