const express = require('express');
const router = express.Router();
const db = require('../models');



let Photo = db.Photo;

router.get('/new', (req,res) => {
  res.render('../views/gallery/new');
});

router.route('/')
  .get((req, res) => {
    Photo.findAll()
    .then((images) =>{
      res.render('index', {images: images});
    });      
  })

  .post((req, res) => {
    Photo.create(
    {
      author: req.body.author,
      link: req.body.link,
      description: req.body.description
    })
    .then(() => {
      res.redirect(303, '/');
    });

  });

router.route('/:id')
  .get((req,res) => {
    Photo.findById(req.params.id)
    .then((image) =>{
      res.render("../views/gallery/single", {image: image});
    });
  })

  .put((req, res) => {
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
        res.redirect(303, `/gallery/${req.params.id}`);
      })
      .catch(err =>{
        console.log('ya done fuck*d up A-A-Ron', err);
        res.redirect(303, `/${req.params.id}/edit`);
      });
  })

  .delete((req, res) => {
    Photo.destroy({
      where: {
        id: `${req.params.id}`
      }
    })
    .then(()=>{
      res.redirect(303, '/gallery');
    });
  });

router.get('/:id/edit', (req, res) => {
  Photo.findById(req.params.id)
    .then((image) =>{
      res.render("../views/gallery/edit", {image: image});
    });
});

// router.route('/login',)
//   .get((req,res)=>{
//     res.render('../views/gallery/new');
//   })
//   .post((req,res)=>{

//   });

module.exports = router;