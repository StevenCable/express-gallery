const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars');
const bp = require('body-parser');
const methodOverride = require('method-override')
const galleryRoute = require('./routes/galleryRoute');
const db = require('./models');
const Photo = db.Photo;
const PORT = process.env.PORT || 3000;
const CONFIG = require('./config/config.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
// const path = require('path');
const app = express();


app.use(express.static('public'));
app.use(bp.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/gallery', galleryRoute);
// app.use(session({
//   secret: CONFIG.SESSION_SECRET
// }));
app.use(passport.initialize());
app.use(passport.session());

// const authenticate = (username, password) => {
//   // get user data from the DB
//   const { USERNAME } = CONFIG;
//   const { PASSWORD } = CONFIG;

//   // check if the user is authenticated or not
   return ( username === USERNAME && password === PASSWORD );
// };

passport.use(new LocalStrategy(
  function (username, password, done) {

    console.log('username, password: ', username, password);

    // // check if the user is authenticated or not
    //sequelize query for findOne() to select a single user to match in table User

    //   return done(null, user); // no error, and data = user
    // }
    // return done(null, false); // error and authenticted = false
  }
));

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/',(req, res) => {
  Photo.findAll({order:"id"})
    .then((images) =>{
      res.render('gallery/list', {images: images});
    });
});

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

app.route('/login')
  .get((req, res) => {
    res.render('gallery/login.hbs');
  })
  .post(passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
  }));

app.get('/secret', isAuthenticated, (req, res) => {
  res.render('gallery/secret');
});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else{
    console.log('suck it trebek');
    res.redirect(303, '/login');
  }
}

app.listen(PORT, ()=>{
  db.sequelize.sync();
  console.log('you are now in the matrix via port, ', PORT);
});

module.exports = app;
