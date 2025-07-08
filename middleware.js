module.exports.isLoggedIn = (req, res, next) => {
      if(!req.isAuthenticated()){
    req.flash('error', "You must be Login in Wonderlust to Create Listings!")
    return res.redirect('/login')
  }
  next()
}