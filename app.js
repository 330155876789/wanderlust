const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const path = require('path');
const Listing = require('./model/listing');
const data = require('./init/data');
const methodeOverride = require('method-override');
const ejsMate = require('ejs-mate');
const  ExpressError = require('./utils/expressError');
const asyncWrap = require('./utils/asyncwrap');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodeOverride('_method'));
app.engine('ejs', ejsMate);



// Connect to MongoDB
main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Wanderlust API');
});

app.get('/listings', asyncWrap(async (req, res) => {
  const listings = await Listing.find();
  res.render('listings/index', { listings });
}));


// create route
app.get("/listings/new", (req, res) => {
  let { price } = req.query;
  if (price) {
    price = parseFloat(price);
    if (isNaN(price) || price < 0) {
      return res.status(400).send('Invalid price');
    }
  }
  res.render("listings/new", { price }); // Pass the price to the form
});

app.post('/listings', asyncWrap(async (req, res) => {

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

  await newListing.save();
  res.redirect(`/listings/${newListing._id}`);
}));

// show route
app.get('/listings/:id', asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError('Listing not found', 404));
  }
  //  console.log(id);
  res.render('listings/show', { listing });
}));


// update route
app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  res.render('listings/edit', { listing });
}));

app.patch('/listings/:id', asyncWrap(async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  const listing = await Listing.findByIdAndUpdate(id, { title, description, price }, { new: true });
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  res.redirect(`/listings/${listing._id}`);
}));

// delete route
app.delete('/listings/:id/delete', asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  res.redirect('/listings');
}));

// Error handling middleware

app.use((req, res, next) => {
  const err = new ExpressError('Page Not Found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).send(message);
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

