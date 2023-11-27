const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const errorMessages = require('./errorMessages');


// Get all users
//TODO: 보안문제(password)로 쓰면 안됨!! get all users 할일이 있을까...
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
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
        console.error(info); //TODO: 배포시 주석처리
        return res.status(401).send(info.reason);
      }

      // 사용자 인증에 성공한 경우, req.login을 통해 세션에 사용자 정보 저장
      req.login(user, async(loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }

          try {
              await updateAccessTimes(user);

              const filteredUser = Object.assign({}, user.toJSON());
              delete filteredUser.password; // 비밀번호 제외
              return res.json(filteredUser);
          } catch (error) {
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
          }
      });
  })(req, res, next);
});
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

//Update accessTimes, lastRequestTime
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
        throw new Error('접속 시간 및 최근 요청 시간을 업데이트하는 데 실패했습니다.');
    }
}

//Logout
router.get('/logout', isLoggedIn,  async(req, res) => {

    req.logout(function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to log out" });
        }
        req.session.destroy(function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to destroy session" });
            }
            res.end();
        });
    });
});

// Create user
router.post('/', isNotLoggedIn, async (req, res) => {
  const user = new User(req.body);
  user.accessTimes = Array(24).fill(0); //시간 배열 초기화
  user.lastRequestTime = Date.now();
  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
      res.status(400).json({ message: "중복된 이메일입니다" });
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
      return res.status(404).json({ message: 'User not found' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).send('User not found');
      }
      const { password, ...userData } = user.toObject();
      res.json(userData);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
  }
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
          const videoInfo = {
              _id: video._id,
              title: video.title,
              subtitle: video.subtitle,
              description: video.description,
              thumb: video.thumb,
              source: video.source,
              bookmark: video.bookmark,
              like: video.like,
              views: video.views
          };

          videosInfo.push(videoInfo);
      }

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

      const bookmarkedVideos = user.bookmarkedVideos; // 사용자가 좋아요한 비디오들
      const videosInfo = [];

      for (const video of bookmarkedVideos) {
          const videoInfo = {
              _id: video._id,
              title: video.title,
              subtitle: video.subtitle,
              description: video.description,
              thumb: video.thumb,
              source: video.source,
              bookmark: video.bookmark,
              like: video.like,
              views: video.views
          };

          videosInfo.push(videoInfo);
      }

      res.status(200).json(videosInfo);
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
          return res.status(404).json({ message: 'User not found' });
      }

      req.login(user, loginErr => {
          if (loginErr) {
              console.error(loginErr);
              return res.status(500).json({ message: 'Error logging in' });
          }

          const { password, ...userData } = user.toObject();
          res.json(userData);
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;