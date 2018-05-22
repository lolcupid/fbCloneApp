const express = require('express'),
methodOverride = require('method-override'),
expressSanitizer = require('express-sanitizer'),
mongoose   = require('mongoose'),
bodyParser = require('body-parser'),
app         = express();
Blog        = require('./models/blog.js'),
Comment        = require('./models/comment.js');

mongoose.connect('mongodb://cupid:cupid451992@ds237868.mlab.com:37868/tutorial');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));



app.get('/', (req, res) => {
  res.redirect('/blog');
});

app.get('/blog', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log('ERROR!!!');
    } else {
      res.render('index', {blogs:blogs});
    }
  })
});

// Goto Form Page to add new post
app.get('/blog/new', (req, res) => {
  res.render('./blog/new');
});

// Add new post
app.post('/blog', (req, res) => {
  req.body.blog.post = req.sanitize(req.body.blog.post);
  Blog.create(req.body.blog, (err, addBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.redirect('/blog');
    }
  })
})

// Detail View
app.get('/blog/:id', (req, res) => {
  Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.render('./blog/detail', {blog: foundBlog});
    }
  })
})

// Edit Page
app.get('/blog/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, editBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.render('./blog/edit', {blog: editBlog});
    }
  })
});

// Update data from DB
app.put('/blog/:id', (req, res) => {
  req.body.blog.post = req.sanitize(req.body.blog.post);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.redirect('/blog/' + req.params.id);
    }
  })
});

// Delete Blog
app.delete('/blog/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.redirect('/blog');
    }
  })
});

// Comment Page
app.get('/blog/:id/comment/new', (req, res) => {
  Blog.findById(req.params.id, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render('./comment/new', {blogs: blogs});
    }
  })
})

// Add Comments
app.post('/blog/:id/comment', (req, res) => {
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

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});