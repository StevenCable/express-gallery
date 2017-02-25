const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override');
const galleryRoute = require('./routes/galleryRoute');
const userRoute = require('./routes/userRoute.js');
const isAuth = require('./public/js/isAuth');
const setUser = require('./public/js/setUser');
const db = require('./models');
const Photo = db.Photo;
const User = db.User;
const PORT = process.env.PORT || 3000;
const CONFIG = require('./config/config.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();


app.use(express.static('public'));
app.use(bp.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({
  store: new RedisStore(),
  secret: 'keyboard cat',
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: {
        username: username,
        password: password
      }
    })
    .then((user) =>{
      return done(null, user); //no error, and data = user
    })
    .catch((err)=>{
      err = "nice fuckin' try...not!";
      return done(null, err); // error and authenticted = false
    });
   }
));  

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    console.log('suck it trebek');
    res.redirect(303, '/login');
  }
}
app.use('/gallery', setUser, galleryRoute);
app.use('/create', userRoute);

app.get('/', setUser,(req, res) => {
   Photo.findAll({
      order: "id",
      include: {
        model: User,
        as: 'user'
      }
  })
    .then((images) =>{
      console.log('images: ', images);
      res.render('gallery/list', {images: images});
    });
});

app.route('/login')
  .get((req, res) => {
    res.render('gallery/login.hbs');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/login'
  }));

app.get('/secret', isAuthenticated, (req, res) => {
  res.render('./gallery/secret');
});

app.post('/logout', (req, res) => {
  req.logout();
  res.redirect(303, '/login');
});

app.listen(PORT, ()=>{
  db.sequelize.sync();
  console.log('you are now in the matrix via port, ', PORT);
});

module.exports = app;
