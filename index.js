const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodeOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRoutes = require('./routes/listings.js')
const reviewsRoutes =require('./routes/reviews.js')
const userRouts=require('./routes/user.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy =require('passport-local')
const Usermodel=require('./model/user.models.js')

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
  cookie:{
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    maxAage:7 * 24 * 60 * 60 * 1000,
    HttpOnly:true
  }
}


// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Wanderlust API');
});

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Usermodel.authenticate()))

passport.serializeUser(Usermodel.serializeUser());
passport.deserializeUser(Usermodel.deserializeUser());


app.use((req,res,next)=>{
   res.locals.success=req.flash('success')
   res.locals.error=req.flash('error')
   next()
})


// Listings routes
app.use('/listings', listingRoutes);

// Reviews routes
app.use( "/listings/:id/review", reviewsRoutes)

// Signup and Login 
app.use('/',userRouts)

// Error handling middleware

app.use((req, res, next) => {
  const err = new ExpressError('Page Not Found', 404);
  next(err);
});

app.use((err, req, res,next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  // console.send(err.message)
  res.render("error.ejs",{message});
  // res.status(statusCode).render('error', { message });
  next()
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

