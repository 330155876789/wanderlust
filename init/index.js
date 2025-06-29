 import{ mongoose } from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Schema = mongoose.Schema;
const initData = require('./data');
const Listing = require('../model/listing');

// Connect to MongoDB
main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// // Function to insert initial data into the database
// const initDB = async () => {
//   await Listing.deleteMany({}); // Clear existing data
//   await Listing.insertMany(initData.data);
//   console.log('Initial data inserted successfully');
// };

// initDB().catch((error) => {
//   console.error('Error inserting initial data:', error);
// });

Listing.insertMany(initData.data)
  .then((result) => {
    console.log('Data inserted successfully:', result);
  })
  .catch((error) => {
    console.error('Error inserting data:', error);
  })
  