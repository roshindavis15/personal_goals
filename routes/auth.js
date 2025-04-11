const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/user');

// @route   GET /auth/register
// @desc    Show register form
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// @route   GET /auth/login
// @desc    Show login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// @route   POST /auth/register
// @desc    Handle user registration
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Validation
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('auth/register', {
      error_msg: errors.map(e => e.msg).join(', '),
      name,
      email
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('auth/register', {
        error_msg: 'Email already registered',
        name,
        email
      });
    }

    const newUser = new User({ name, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/auth/login');

  } catch (err) {
    console.error(err);
    res.render('auth/register', {
      error_msg: 'An error occurred during registration. Please try again.',
      name,
      email
    });
  }
});

// @route   POST /auth/login
// @desc    Handle user login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// @route   GET /auth/logout
// @desc    Handle user logout
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
  });
});

module.exports = router;
