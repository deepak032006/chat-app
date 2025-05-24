const express = require('express');
const passport = require('passport');
const { register, login } = require('../controller/auth.controller.js');
const upload = require('../middlewares/upload.middleware.js');

const router = express.Router();

// Normal login/register
router.post('/register', upload.single('avatar'), register);
router.post('/login', login);

// routes/auth.router.js
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    session: true,
  }),
  (req, res) => {
    const user = {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    };

    // Redirect user to frontend with user data as query
    res.redirect(`http://localhost:5173?user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);


module.exports = router;
