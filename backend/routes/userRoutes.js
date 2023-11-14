const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
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

//Login
router.post('/login', isNotLoggedIn , (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (info) {
      console.error(info);
      return res.status(401).send(info.reason);
    }

    return req.login(user, (loginErr) => {

      if (loginErr) return next(loginErr);

      const filteredUser = Object.assign({}, user.toJSON());
      delete filteredUser.password; //비밀번호 제외
      return res.json(filteredUser);
    });
  })(req, res, next);
});



//Logout
router.get('/logout',isLoggedIn ,(req, res)=>{
  req.logout()
  req.session.destroy();
  //TODO: 여기서 종료시간 체크
  res.redirect('/')
});

// Create user
router.post('/', isNotLoggedIn, async (req, res) => {
  const user = new User(req.body);
  console.log(req);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
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