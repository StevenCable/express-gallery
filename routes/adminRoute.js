const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuth = require('../public/js/isAuth');
const setUser = require('../public/js/setUser');

let Photo = db.Photo;
let User = db.User;


router.route('/')
  .get(isAuth, (req,res) => {
    User.findAll({order: "id"})
      .then((users)=>{
        res.render('./partials/admin', {users:users});
      });
  });

router.route('/deleteUser/:id')
  .get(isAuth, (req,res) =>{
     User.destroy({
              where: {
                id: `${req.params.id}`
              }
            })
              .then(()=>{
                res.redirect(303, '/admin');
              });
  });

module.exports = router;