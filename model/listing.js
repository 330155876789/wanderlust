const mongoose = require('mongoose');
const { Schema } = mongoose;

const dataSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    url: String,
    filename: String
  },

  price: {
    type: Number,
    default: 0
  },
  location: {
    type: String
  },
  country: {
    type: String,
    required: false
  }
  ,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
},{timestamps:true});

// Middleware to validate price
dataSchema.post('findOneAndDelete' , async (Listing) => {
  if (Listing) {
    // Assuming you have a Review model and you want to delete associated reviews
    const Review = mongoose.model('Review');
    await Review.deleteMany({ _id: { $in: Listing.reviews } });
  }
});


const Listing = mongoose.model('Listing', dataSchema);

module.exports = Listing;