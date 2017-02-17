const express = require('express');
const router = express.Router();
const handlebars = require('express-handlebars');
const bp = require('body-parser');
const indexRoute = require('./routes/indexRoute');
const galleryRoute = require('./routes/galleryRoute');
const db = require('./models');
const Photo = db.Photo;
const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.static('public'));
app.use(bp.urlencoded({extended: true}));
app.use('/gallery', galleryRoute);

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/',(req, res) => {
  Photo.findAll()
    .then((images) =>{
      res.render('index', {images: images});
    });
});


app.listen(PORT, ()=>{
  db.sequelize.sync();
  console.log('you are now in the matrix via port, ', PORT);
});

module.exports = app;
