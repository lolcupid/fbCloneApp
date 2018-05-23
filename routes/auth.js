const express       = require('express'),
      router        = express.Router(),
      passport      = require('passport'),
      User          = require('../models/user.js');

// Register Page
router.get('/register', (req, res) => {
  res.render('register');
})

// Register Function
router.post('/register', (req, res) => {
  User.register(new User({username: req.body.username, userimage: req.body.userimage}), req.body.password, (err, user) => {
    if(err) {
      console.log(err);
      return res.render('login');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/blog');
    })
  })
})

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
})

// Login function
router.post('/login', passport.authenticate('local', {
  successRedirect: '/blog',
  failureRedirect: '/login'
}),(req, res) => {
})

// LogOut
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

// Middleware to prevent routing to secret page
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;