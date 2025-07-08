const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
 Comments: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
    createdAt: {
    type: Date,
    default: Date.now()
  },    
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  }
},{timestamps:true});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
// This code defines a Mongoose schema for reviews, which includes fields for the review Comments, rating, and a reference to the listing being reviewed. The rating must be between 1 and 5, and the listing reference is required. The Review model is then exported for use in other parts of the application.