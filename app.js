const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const path = require('path');
const Listing = require('./model/listing');
const data = require('./init/data');
const methodeOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}



// Routes
app.get('/', (req, res) => {
 res.send('Welcome to the Wanderlust API');
});

app.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.render('listings/index', { listings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// create route
// This should come first
app.get("/listings/new", (req, res) => {
    res.render("listings/new"); // or however you render your form
});

app.post('/listings', async (req, res) => {

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
//  console.log("Received form data:", req.body);
//   console.log("New listing object:", newListing);
   await newListing.save();
  //  console.log(newListing);
   res.redirect(`/listings/${newListing._id}`);
});

// show route
app.get('/listings/:id', async (req, res) => {
   const { id } = req.params;
   const listing = await Listing.findById(id);
   if (!listing) {
     return res.status(404).send('Listing not found');
   }
  //  console.log(id);
   res.render('listings/show', { listing });
});


// update route
app.get("/listings/:id/edit",async (req,res)=>{
  const {id} = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    return res.status(404).send('Listing not found');
  }
  res.render('listings/edit', { listing });
});

app.patch('/listings/:id', async (req , res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  try {
    const listing = await Listing.findByIdAndUpdate(id, { title, description, price }, { new: true });
    console.log(listing);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// delete route
app.delete('/listings/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.redirect('/listings');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 

