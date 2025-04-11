const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth.js');

router.get('/', (req, res) => res.render('login'));
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.name}, you are logged in!`);
});

module.exports = router;
