//checks current Session user and matches against 'posted_by' FKey in Photos table. Only matches can edit ie next()

//this function aint ready yet! user.id isn't correct i dont think

let editPermission = ((user) => {
  if(user.id === req.user.id){
    console.log('user match');
    next();
  }else{
    console.log('dont mess with other people\'s stuff');
    res.redirect(303, './gallery');
  }
});

module.exports = editPermission;