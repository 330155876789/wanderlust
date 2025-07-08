const express = require('express');
const router = express.Router();
const  ExpressError = require('../utils/expressError');
const asyncWrap = require('../utils/asyncwrap');
const Listing = require('../model/listing');
const methodeOverride = require('method-override');
const {isLoggedIn}=require('../middleware.js')
// const ejs = require('ejs');


router.use(methodeOverride('_method'));

router.get('/', asyncWrap(async (req, res) => {
  const listings = await Listing.find();
  res.render('listings/index', { listings });
}));

// create route
router.get("/new",isLoggedIn,(req, res) => {
  res.render("listings/new.ejs"); // Pass the price to the form
});

router.post('/',isLoggedIn, asyncWrap(async (req, res) => {
  const newListing = new Listing({
    title: req.body.title, 
    description: req.body.description,
    price: req.body.price,
    location: req.body.location,
    country: req.body.country,
    image: {
      url: req.body.image.url
    }
  });
  if(!req.body.listing){
    throw new ExpressError("send valid data for listing",400)
  }
  const savedata = await newListing.save(); 
  req.flash('success','Listing is created successfully!!')
  res.redirect(`listings/${newListing._id}`);
}));

// show route
router.get('/:id',asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    req.flash('error','Listing are you searching , It does not Exist ')
    return res.redirect('/listings')
  }
  //  console.log(id);
  res.render('listings/show', { listing})
}));

// update route
router.get("/:id/edit",isLoggedIn, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  res.render('listings/edit', { listing });
}));

router.patch('/:id', asyncWrap(async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  const listing = await Listing.findByIdAndUpdate(id, { title, description, price }, { new: true });
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  req.flash('success','Listing is Updated!!')
  res.redirect(`/${listing._id}`);
}));

// delete route
router.delete('/:id/delete',isLoggedIn, asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  req.flash('success','Listing is Deleted!!')
  res.redirect('/listings');
}));


module.exports = router;