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
          // add user's id, name, image to comment
          newComment.author.id = req.user._id;
          newComment.author.username = req.user.username;
          newComment.author.userimage = req.user.userimage;
          newComment.save();
          // link b/t blog and comment
          blogs.comments.push(newComment);
          blogs.save();
          res.redirect('/blog/' + req.params.id);
        }
      })
    }
  })
})

// delete comment
router.delete('/:commentid', isLoggedIn, (req, res) => {
  Comment.findByIdAndRemove(req.params.commentid, (err, foundcomment) => {
        if(err) {
          console.log(err);
        } else {
          res.redirect('/blog/'+req.params.id);
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