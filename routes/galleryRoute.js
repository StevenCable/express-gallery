const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuth = require('../public/js/isAuth');
const setUser = require('../public/js/setUser');

let Photo = db.Photo;
let User = db.User;

router.route('/new')
  .get(isAuth, (req,res) => {
    res.render('./gallery/new');
});

router.route('/')
  .get((req, res) => {
    Photo.findAll({
      order: "id",
      include: {
        model: User,
        as: 'user'
      }
  })
    .then((images) =>{
      if(req.user){
        console.log('req.user', req.user);
        res.render('./gallery/list', {
          images:images,
          user: req.user.username
        });
      }else{
        res.render('./gallery/list', {images:images});
      }
            
    });      
  })

  .post(isAuth, (req, res) => {
    Photo.create(
      {
        author: req.body.author,
        link: req.body.link,
        description: req.body.description,
        posted_by: req.user.id
      })
    .then(() => {
      res.redirect(303, '/gallery');
    });
  });

router.route('/:id')
  .get((req,res) => {
    Photo.findById(req.params.id)
    .then((image) =>{
      User.findById(image.posted_by)
        .then((user)=>{      
            Photo.findAll({
              order: "id",
              include: {
              model: User,
              as: 'user'
              }
            })
            .then((images)=>{
              images.splice(0,1);

          res.render("./gallery/single", {
            image: image,
            images: images,
            user: user
          });
        });
      });      
    });
  })

  .put(isAuth,(req, res) => {
    Photo.update({
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
      },
        {where: {
          id: `${req.params.id}`
        }
      }
    )
      .then(() =>{
        res.redirect(303, `/gallery`);
      })
      .catch(err =>{
        console.log('ya done fuck*d up A-A-Ron', err);
        res.redirect(303, `/${req.params.id}/edit`);
      });
  })

  .delete(isAuth, (req, res) => {
    Photo.findById(req.params.id)
      .then((image) =>{
        if(image.posted_by === req.user.id){
            Photo.destroy({
              where: {
                id: `${req.params.id}`
              }
            })
              .then(()=>{
                res.redirect(303, '/gallery');
              });        
        }else{
            console.log('You can\'t fuck with other people\'s shit');
            res.redirect(303, `/gallery/${req.params.id}`);
        }
      });    
  });

router.route('/:id/edit') 
  .get(isAuth, (req, res) => {
    Photo.findById(req.params.id)
    .then((image) =>{

      if(image.posted_by === req.user.id){
        res.render("./gallery/edit", {image: image});
      }else{
        console.log('You can\'t fuck with other people\'s shit');
        res.redirect(303, `/gallery/${req.params.id}`);
      }
    });
  });



module.exports = router;