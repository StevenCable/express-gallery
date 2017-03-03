// check for Admin status
const isAdmin = (function isAuthenticated(req, res, next){
  if(req.user.username === "admin"){
    return true;
  }else{
    next();
  }
});

module.exports = isAdmin;