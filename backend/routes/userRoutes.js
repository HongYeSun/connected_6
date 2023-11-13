const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

// Local Strategy 설정
passport.use(new LocalStrategy(async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: '사용자를 찾을 수 없습니다.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Login user
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout user
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Create user
router.post('/', async (req, res) => {
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