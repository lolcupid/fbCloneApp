const express       = require('express'),
      router        = express.Router();
      Blog      = require('../models/blog.js');


// Get All blogs from DB
router.get('/',isLoggedIn, (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log('ERROR!!!');
    } else {
      res.render('index', {blogs:blogs});
    }
  })
});

// Goto Form Page to add new post
router.get('/new',isLoggedIn, (req, res) => {
  res.render('./blog/new');
});

// Add new post
router.post('/',isLoggedIn, (req, res) => {
  req.body.post = req.sanitize(req.body.post);
  const title = req.body.title;
  const image = req.body.image;
  const post = req.body.post;
  const user = {
    id: req.user._id,
    username: req.user.username,
    userimage: req.user.userimage
  };
  const newFormattedBlog = {title:title, image:image, post:post, user:user};

  Blog.create(newFormattedBlog, (err, addBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.redirect('/blog');
    }
  })
})

// Detail View
router.get('/:id',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.render('./blog/detail', {blog: foundBlog});
    }
  })
})

// Edit Page
router.get('/:id/edit',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, editBlog) => {
    if(editBlog.user.id.equals(req.user._id)) {
      if(err) {
        res.redirect('/blog');
      } else {
        res.render('./blog/edit', {blog: editBlog});
      }
    } else {
      res.redirect('/blog/'+req.params.id);
    }
  })
});

// Update data from DB
router.put('/:id',isLoggedIn, (req, res) => {
  req.body.blog.post = req.sanitize(req.body.blog.post);
  if(editBlog.user.id.equals(req.user._id)) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
      if(err) {
        res.redirect('/blog');
      } else {
        res.redirect('/blog/' + req.params.id);
      }
    })
  } else {
    res.redirect('/blog');
  }
});

// Delete Blog
router.delete('/:id',isLoggedIn, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.redirect('/blog');
    }
  })
});

// Middleware to prevent routing to secret page
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router
