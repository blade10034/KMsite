var isAuthenticated = function(req, res, next) {

  var isAuth = req.isAuthenticated();

  if (req.isAuthenticated()) {
      res.locals.user = req.user;
      return next();
  }else{
    res.locals.user = null;
    return next();
  }
};

module.exports = isAuthenticated;
