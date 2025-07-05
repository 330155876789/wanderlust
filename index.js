const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodeOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listenRoutes = require('./routes/listings.js')
const reviewsRoutes =require('./routes/reviews.js')
const session = require('express-session')
const flash = require('connect-flash')

// Connect to MongoDB
main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodeOverride('_method'));
app.engine('ejs', ejsMate);

const sessionOptions={
  secret: 'oursecreatekey',
  resave: false,
  saveUninitialized: true,
  Cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
    maxAage:7 * 24 * 60 * 60 * 1000,
    HttpOnly:true
  }
}

app.use(session(sessionOptions))


// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Wanderlust API');
});


app.use(flash())

app.use((req,res,next)=>{
   res.locals.success=req.flash('success')
   next()
})

// Listings routes
app.use('/listings', listenRoutes);

// Reviews routes
app.use( "/listings/:id/review", reviewsRoutes)

// Error handling middleware

app.use((req, res, next) => {
  const err = new ExpressError('Page Not Found', 404);
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  // console.send(err.message)
  res.render("error.ejs",{message});
  // res.status(statusCode).render('error', { message });
  next()
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

