const express       = require('express'),
      router        = express.Router({mergeParams: true}),
      Blog      = require('../models/blog.js'),
      Comment      = require('../models/comment.js');

      
// Comment Page
router.get('/new',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render('./comment/new', {blogs: blogs});
    }
  })
})

// Add Comments
router.post('/',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, newComment) => {
        if(err) {
          console.log(err);
        } else {
          // link b/t blog and comment
          blogs.comments.push(newComment);
          blogs.save();
          res.redirect('/blog/' + req.params.id);
        }
      })
    }
  })
})

// Middleware to prevent routing to secret page
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;