const express                  = require('express'),
      methodOverride           = require('method-override'),
      expressSanitizer         = require('express-sanitizer'),
      passport                 = require('passport'),
      AuthUser                 = require('./models/user.js'),
      LocalStrategy            = require('passport-local'),
      passportLocalMongoose    = require('passport-local-mongoose'),
      mongoose                 = require('mongoose'),
      bodyParser               = require('body-parser'),
      User                     = require('./models/user.js'),
      Blog                     = require('./models/blog.js'),
      Comment                  = require('./models/comment.js');

const app         = express();
mongoose.connect('mongodb://cupid:cupid451992@ds237868.mlab.com:37868/tutorial');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(expressSanitizer());

// Passport Config
app.use(require('express-session')({
  secret: 'this is for encoding',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(AuthUser.authenticate()));
passport.serializeUser(AuthUser.serializeUser());
passport.deserializeUser(AuthUser.deserializeUser());

// Middleware
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// Home Page
app.get('/', (req, res) => {
  res.render('login');
});

// Get All blogs from DB
app.get('/blog',isLoggedIn, (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log('ERROR!!!');
    } else {
      res.render('index', {blogs:blogs});
    }
  })
});

// Goto Form Page to add new post
app.get('/blog/new',isLoggedIn, (req, res) => {
  res.render('./blog/new');
});

// Add new post
app.post('/blog',isLoggedIn, (req, res) => {
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
app.get('/blog/:id',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.render('./blog/detail', {blog: foundBlog});
    }
  })
})

// Edit Page
app.get('/blog/:id/edit',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, editBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.render('./blog/edit', {blog: editBlog});
    }
  })
});

// Update data from DB
app.put('/blog/:id',isLoggedIn, (req, res) => {
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
app.delete('/blog/:id',isLoggedIn, (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
    if(err) {
      res.redirect('/blog');
    } else {
      res.redirect('/blog');
    }
  })
});

// Comment Page
app.get('/blog/:id/comment/new',isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blogs) => {
    if(err) {
      console.log(err);
    } else {
      res.render('./comment/new', {blogs: blogs});
    }
  })
})

// Add Comments
app.post('/blog/:id/comment',isLoggedIn, (req, res) => {
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

// Register Page
app.get('/register', (req, res) => {
  res.render('register');
})

// Register Function
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login');
})

// Login function
app.post('/login', passport.authenticate('local', {
  successRedirect: '/blog',
  failureRedirect: '/login'
}),(req, res) => {
})

// LogOut
app.get('/logout', (req, res) => {
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

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});