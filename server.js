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
const bcrypt = require('bcrypt');


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
        }
      }).then( user =>{
        if(user === null){
          console.log('user ain\'t showin');
          return done(null, false);
        }else{
          bcrypt.compare(password,user.password).then((res)=>{
            if(res){
              return done(null, user);
            }else{
              return done(null, false);
            }
          });
       
        }
      }).catch((err)=>{
        console.log('error', err);
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
  console.log('user is: ', user);
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


// app.get('/', setUser,(req, res) => {
//   res.render('/gallery',);
// });

app.route('/:user/gallery')
  .get((req, res)=>{
    Photo.findAll({
      order: "id",
      include: {
        model: User,
        as: 'user'
      },
      where: {
        posted_by: req.user.id,
      }
    })
      .then((images) =>{
        console.log('special user: ', images);
        res.render('./gallery/list', {
          images:images,
          user: req.user.username
        });
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
