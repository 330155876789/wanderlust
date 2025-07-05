const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/expressError.js');
const asyncWrap = require('../utils/asyncwrap.js');
const Listing = require('../model/listing.js');
const Review = require('../model/reviews.js');

// Reviews routes
// submit reviews
router.post('/',asyncWrap( async (req , res) => {
let listing = await Listing.findById(req.params.id);
 let newReview = new Review({
    Comments: req.body.review.Comments,
    rating: req.body.review.rating,
    listing: listing._id
  });
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
   req.flash('success','Review is Submited!!')
  res.redirect(`/listings/${listing._id}` );
}))

// delete reviews
router.delete('/:reviewId', asyncWrap(async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findByIdAndUpdate(id,{ $pull: { reviews: reviewId } }, { new: true });

  let review = await Review.findByIdAndDelete(reviewId);
  console.log(review)
   req.flash('success','Review is Deleted!!')
  res.redirect(`/listings/${listing._id}`);
}));

module.exports = router;