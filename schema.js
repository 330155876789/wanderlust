const joi=require('joi');
const listingSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().min(0).required(),
  location: joi.string().required(),
  image: joi.string().uri().required()
}); 

const reviewSchema = joi.object({
  Comments: joi.string().required(),
  rating: joi.number().min(1).max(5).required(),
  listingId: joi.string().required() // Assuming listingId is a string representation of the ObjectId
});
module.exports = {
  listingSchema,
  reviewSchema
};