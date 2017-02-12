const express = require('express');
const handlebars = require('express-handlebars');
const bp = require('body-parser');
const indexRoute = require('./routes/index.js');
const PORT = process.env.PORT || 3000;
const app = express();
const db = require('./models');

app.use(express.static('public'));
app.use('/gallery', indexRoute);
app.use(bp.urlencoded({extended: true}));

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.listen(PORT, ()=>{
  db.sequelize.sync();
  console.log('you are now in the matrix via port, ', PORT);
});
