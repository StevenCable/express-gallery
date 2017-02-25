const express = require('express');
const router = express.Router();
const db = require('../models');

let User = db.User;

router.get('/', (req,res) => {
  res.render('./partials/createUser');
});

router.post('/', (req,res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then((user) => {
    res.redirect(303, '/login');
  });
});

module.exports = router;