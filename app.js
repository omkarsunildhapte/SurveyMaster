// Standard library imports
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware to parse request bodies and static files serving
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Connect to MongoDB and start the server within the connection callback
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exits the process if MongoDB connection fails
  });

// Route imports
const surveyRoutes = require('./routes/surveyroutes');

// Use survey routes
app.use('/surveys', surveyRoutes);

// Define a route for the home page
app.get('/', (req, res) => {
  res.render('home'); // Renders the home.ejs as the landing page
});

// ...any additional routes or error handling
