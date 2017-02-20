const express = require('express');
const router = express.Router();
const db = require('../models');



let Photo = db.Photo;

router.get('/new', (req,res) => {
  res.render('./gallery/new');
});

router.route('/')
  .get((req, res) => {
    Photo.findAll({order: "id"})
    .then((images) =>{
      res.render('./gallery/list', {images: images});
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
      res.redirect(303, './');
    });

  });

router.route('/:id')
  .get((req,res) => {
    Photo.findById(req.params.id)
    .then((image) =>{
      res.render("./gallery/single", {image: image});
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
        res.redirect(303, `./`);
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
      res.redirect(303, '/');
    });
  });

router.get('/:id/edit', (req, res) => {
  Photo.findById(req.params.id)
    .then((image) =>{
      res.render("./gallery/edit", {image: image});
    });
});


module.exports = router;