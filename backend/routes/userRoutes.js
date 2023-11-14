const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { activeUsers }  = require('./cron'); // 활동 중인 사용자 목록


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    // console.log(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//TODO:왜 한번 로그인 성공한 다음에 서버가 멈춰버리지?
//Login
router.post('/login', isNotLoggedIn,(req, res, next) => {
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
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }

        // 세션에 저장된 사용자 정보에서 필요한 정보 추출
        const { _id, email } = user; // 필요한 정보로 수정 필요

        // activeUsers 배열에 필요한 정보만 저장 (예: id나 email)
        const userInfo = { _id, email }; // 필요한 정보로 수정 필요
        activeUsers.push(userInfo);

      const filteredUser = Object.assign({}, user.toJSON());
      delete filteredUser.password; // 비밀번호 제외
      return res.json(filteredUser);
      });
  })(req, res, next);

});


//Logout
router.get('/logout', isLoggedIn,  (req, res) => {

    const user = req.user;

    // activeUsers 배열에서 제거
    const index = activeUsers.findIndex((activeUser) => activeUser._id.toString() === user._id.toString());
    if (index !== -1) {
      activeUsers.splice(index, 1);
    }

    // 나머지 로그아웃 로직
    req.logout();
    req.session.destroy();
    res.redirect('/');

});

// Create user
//TODO: 각 해당사항별로 메세지 관리(이메일 중복.. 나머지는 required 문제라 프론트에서 해결하면 될듯?)
router.post('/', isNotLoggedIn, async (req, res) => {
  const user = new User(req.body);
  console.log(req);
  user.accessTimes = Array(24).fill(0); //시간 배열 초기화

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

module.exports = router;