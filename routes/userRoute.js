const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

let User = db.User;

router.get('/', (req,res) => {
  res.render('./partials/createUser');
});

router.post('/', (req,res) =>  {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      User.create({
        username: req.body.username,
        password: hash
      })
      .then(()=>{
        res.redirect(303, '/login');
      });
    });
  });
});


module.exports = router;