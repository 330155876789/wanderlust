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
    url: {
      type: String
    }
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
});

const Listing = mongoose.model('Listing', dataSchema);

module.exports = Listing;