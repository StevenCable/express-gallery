const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuth = require('../public/js/isAuth');

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
      console.log("imagesBra", images[0]);
      res.render('./gallery/list', {images: images});
    });      
  })

  .post(isAuth, (req, res) => {
    // User.findOne({
    //   where: {
    //     req.user.username
    //   }
    // })
    Photo.create(
    {
      author: req.body.author,
      link: req.body.link,
      description: req.body.description,
      posted_by: req.user.id
    })
    .then(() => {
      res.redirect(303, './');
    });

    // console.log('req.user: ', req.user);
    // console.log('req.body.author ', req.body.author)

  });

router.route('/:id')
  .get((req,res) => {
    Photo.findById(req.params.id)
    .then((image) =>{
      Photo.findAll({order: "id"})
      .then((images)=>{
        images.splice(0,1);

        res.render("./gallery/single", {
          image: image,
          images: images
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
        res.redirect(303, `./`);
      })
      .catch(err =>{
        console.log('ya done fuck*d up A-A-Ron', err);
        res.redirect(303, `/${req.params.id}/edit`);
      });
  })

  .delete(isAuth,(req, res) => {
    Photo.destroy({
      where: {
        id: `${req.params.id}`
      }
    })
    .then(()=>{
      res.redirect(303, '/');
    });
  });

router.route('/:id/edit') 
  .get(isAuth,(req, res) => {
    Photo.findById(req.params.id)
    .then((image) =>{
      res.render("./gallery/edit", {image: image});
    });
  });


module.exports = router;