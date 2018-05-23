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

const authRoute = require('./routes/auth');
const blogRoute = require('./routes/blog');
const commentRoute = require('./routes/comment');

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

app.use('/blog', blogRoute);
app.use('/blog/:id/comment', commentRoute);
app.use(authRoute);

app.listen(3000, () => {
  console.log(`Server is running at port 3000`);
});