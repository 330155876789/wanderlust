const express = require('express');
const router = express.Router();
const  ExpressError = require('../utils/expressError');
const asyncWrap = require('../utils/asyncwrap');
const Listing = require('../model/listing');
const methodeOverride = require('method-override');
const ejs = require('ejs');

router.use(methodeOverride('_method'));


router.get('/', asyncWrap(async (req, res) => {
  const listings = await Listing.find();
  res.render('listings/index', { listings });
}));

// create route
router.get("/new", (req, res) => {
  let { price } = req.query;
  if (price) {
    price = parseFloat(price);
    if (isNaN(price) || price < 0) {
      return res.status(400).send('Invalid price');
    }
  }
  res.render("listings/new", { price }); // Pass the price to the form
});

router.post('/', asyncWrap(async (req, res) => {
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
  // if(!req.body.listing){
  //   throw new ExpressError("send valid data for listing",400)
  // }
  await newListing.save();
  res.redirect(`listings/${newListing._id}`);
}));

// show route
router.get('/:id',asyncWrap(async (req, res) => {
 
     const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    return next(new ExpressError('Listing not found', 404));
  }
  //  console.log(id);
  res.render('listings/show', { listing})

}));


// update route
router.get("/:id/edit", asyncWrap(async (req, res) => {
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
  res.redirect(`/${listing._id}`);
}));

// delete route
router.delete('/:id/delete', asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  res.redirect('/listings');
}));


module.exports = router;