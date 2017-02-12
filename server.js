const express = require('express');
const handlebars = require('express-handlebars');
const bp = require('body-parser');
const indexRoute = require('./routes/index.js');
// const methodOverride = require('method-override');
//need to require any time we add a new route file
const PORT = process.env.PORT || 3000;
const app = express();
const db = require('./models');


const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'))
app.use(bp.urlencoded({extended: true}));
app.use('/', indexRoute);
//app.use(methodOverride('_method'));
//add app.use for other js files through their routes!
app.listen(PORT, ()=>{
  db.sequelize.sync();
  console.log('you are now in the matrix via port, ', PORT);
});
