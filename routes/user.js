const express = require("express");
const usermodel = require("../model/user.models");
const router = express.Router();
const asyncWrap = require("../utils/asyncwrap");
const passport =require("passport")


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      let { username, password, email } = req.body;
      let NewUser = new usermodel({username,email});
      let RegisteredUser = await usermodel.register(NewUser, password);
      console.log(RegisteredUser);
      req.flash("success", "Welcome to wanderlust!!");
      res.redirect("/listings");
    } catch (error) {
         req.flash("error", error.message);
         res.redirect('/signup')
    }
  })
);

router.get('/login',(req, res) => {
  res.render("users/login.ejs");
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash:true,
}),async(req,res)=>{
   req.flash('success',"Welcome back to Wonderlust!!")
   res.redirect("/listings");
})

router.get('/logout',(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err)
    }
    req.flash('success','You are Logged out!!')
    res.redirect('/listings')
  })
})

module.exports = router;
