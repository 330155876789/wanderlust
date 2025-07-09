module.exports.isLoggedIn = (req, res, next) => {
      if(!req.isAuthenticated()){
      //  console.log(req.originalUrl);
        // req.session.redirectUrl = req.originalUrl;
       console.log(res.session);
      req.flash('error', "You must be Login in Wonderlust to Create Listings!")
      return res.redirect('/login')
  }
  next()
}

module.exports.saveRedirectURL = (req, res, next) => {
  if (
    req.session &&
    !["/login", "/signup"].includes(req.originalUrl) &&
    req.method === "GET"
  ) {
    req.session.redirectUrl = req.originalUrl;
  }
  next();
};
