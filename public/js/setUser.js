let setUser = ((req, res, next)=>{
  if(req.user){
    res.locals.username = req.user.username;
    next();
  }else{
    res.locals.username = null;
    next();
  }
});

module.exports = setUser;
