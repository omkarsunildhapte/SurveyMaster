// app.js

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const Survey = require('./models/survey'); // Adjust the path accordingly

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

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
    process.exit(1);
  });

const surveyRoutes = require('./routes/surveyroutes');
app.use('/surveys', surveyRoutes);

// Define a route for the home page
app.get('/', (req, res) => {
  res.render('home'); // Renders the home.ejs as the landing page
});

// ...any additional routes or error handling
