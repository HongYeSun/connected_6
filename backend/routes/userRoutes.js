const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Video=require('../models/Video');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const errorMessages = require('./errorMessages');
const {getKoreanTime,updateAccessTimes} =require('./screenTime');
const PopularVideo = require("../models/PopularVideo");


// Get all users
// password 빼고 전달
router.get('/', async (req, res) => {
  try {
      const users = await User.find().select('-password');
      res.json(users);
    // console.log(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Login
router.post('/login', isNotLoggedIn, async(req, res, next) => {
  passport.authenticate('local',  (err, user, info) => {

      if (err) {
        console.error(err);
        return next(err);
      }

      if (info) {
        console.error(info);
        return res.status(401).send(info.reason);
      }

      // 사용자 인증에 성공한 경우, req.login 통해 세션에 사용자 정보 저장
      req.login(user, async(loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }

          try {
              await updateAccessTimes(user);

              const { password, ...userData } = user.toObject();
              return res.json(userData);
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: errorMessages.serverError });
          }
      });
  })(req, res, next);
});


//Logout
router.get('/logout', isLoggedIn,  async(req, res) => {
    const userId = req.user._id;
    const user=User.findById(userId);
    await updateAccessTimes(user);
    req.logout(function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: errorMessages.logoutError });
        }
        req.session.destroy(function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: errorMessages.sessionError });
            }
            res.end();
        });
    });
});


router.get('/like', isLoggedIn, async (req, res) => {
  try {
      const userId = req.user._id;

      const user = await User.findById(userId).populate('likedVideos');

      if (!user) {
          return res.status(404).json({ message: errorMessages.userNotFound });
      }

      const likedVideos = user.likedVideos; // 사용자가 좋아요한 비디오들
      const videosInfo = [];

      for (const video of likedVideos) {
          const { _id, title, subtitle, description, thumb, source, bookmark, like, views } = video;
          const videoInfo = { _id, title, subtitle, description, thumb, source, bookmark, like, views };

          videosInfo.push(videoInfo);
      }

      await updateAccessTimes(user);
      res.status(200).json(videosInfo);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorMessages.serverError });
  }
});

router.get('/bookmark', isLoggedIn, async (req, res) => {
  try {
      const userId = req.user._id;

      const user = await User.findById(userId).populate('bookmarkedVideos');

      if (!user) {
          return res.status(404).json({ message: errorMessages.userNotFound });
      }

      const bookmarkedVideos = user.bookmarkedVideos; // 사용자가 북마크한 비디오들
      const videosInfo = [];

      for (const video of bookmarkedVideos) {
          const { _id, title, subtitle, description, thumb, source, bookmark, like, views } = video;
          const videoInfo = { _id, title, subtitle, description, thumb, source, bookmark, like, views };
          videosInfo.push(videoInfo);
      }
      await updateAccessTimes(user);
      res.status(200).json(videosInfo);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: errorMessages.serverError });
  }
});

//최근 비디오
router.get('/recent-videos', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('recentVideos');

        if (!user) {
            return res.status(404).json({ message: errorMessages.userNotFound });
        }

        const recentVideos = user.recentVideos; // 사용자가 최근 본 비디오들 10개
        const videosInfo = [];

        for (const video of recentVideos) {
            const { _id, title, subtitle, description, thumb, source, bookmark, like, views } = video;
            const videoInfo = { _id, title, subtitle, description, thumb, source, bookmark, like, views };
            videosInfo.push(videoInfo);
        }
        await updateAccessTimes(user);
        res.status(200).json(videosInfo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.serverError });
    }

});

// 사용자의 연령에 맞는 인기 비디오
router.get('/age-videos', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: errorMessages.userNotFound });
        }
        let age=Math.floor(user.age/10);
        if(age>7){
            age=7;
        }
        const popularVideos = await PopularVideo.findOne();
        const ageVideoIds = popularVideos.byAge[age]; // 나이 그룹에 해당하는 ObjectId 배열

// Video 모델에서 해당 ObjectId 배열에 해당하는 비디오들을 가져오기
        //TODO: 이런식으로 다른 비디오도 고치기
        const ageVideos = await Video.find({ _id: { $in: ageVideoIds } });
        console.log(ageVideos);
        await updateAccessTimes(user);

        res.status(200).json(ageVideos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.serverError });
    }

});
// 사용자의 gender에 맞는 인기 비디오
router.get('/gender-videos', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: errorMessages.userNotFound });
        }
        const gender=user.gender;

        const popularVideos = await PopularVideo.findOne();
        const genderVideoIds = popularVideos.byGender[gender]; //  ObjectId 배열

// Video 모델에서 해당 ObjectId 배열에 해당하는 비디오들을 가져오기
        //TODO: 이런식으로 다른 비디오도 고치기
        const genderVideos = await Video.find({ _id: { $in: genderVideoIds } });
        //TODO: 이거 거치면 순서가 reverse되는것 같은 느낌...?? 확인해보기
        console.log(genderVideos);
        await updateAccessTimes(user);

        res.status(200).json(genderVideos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: errorMessages.serverError });
    }

});
// Auto-login 
router.post('/auto-login', async (req, res) => {
  try {
      const { userId } = req.body;

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: errorMessages.userNotFound });
      }

      req.login(user, loginErr => {
          if (loginErr) {
              console.error(loginErr);
              return res.status(500).json({ message: errorMessages.loginError });
          }

          const { password, ...userData } = user.toObject();
          res.json(userData);
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: errorMessages.serverError });
  }
});


// Create user
router.post('/', isNotLoggedIn, async (req, res) => {
    const user = new User(req.body);
    user.accessTimes = Array(24).fill(0); //시간 배열 초기화
    user.weekAccessTimes = Array(24).fill(0);
    user.lastRequestTime = getKoreanTime();
    const hour = new Date(user.lastRequestTime).getHours();
    user.accessTimes[hour]++;
    user.weekAccessTimes[hour]++;
    try {
        await user.save();
        const { password, ...userData } = user.toObject();
        return res.json(userData);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
            res.status(400).json({ message: errorMessages.duplicateEmail });
        } else {
            res.status(400).json({ message: err.message });
        }
    }
});

// Update user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: errorMessages.userNotFound});
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: errorMessages.userNotFound });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send(errorMessages.userNotFound);
        }
        const { password, ...userData } = user.toObject();
        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;