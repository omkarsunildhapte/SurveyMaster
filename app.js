// app.js

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy; // Add GitHubStrategy
const session = require('express-session');
const User = require('./models/user');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Set up session middleware
app.use(session({ secret: 'b9e4d8b6a1777d83cfbffcbeab7ac69f5d04e29d2a00007c7808bb787c384a0c', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Passport configuration
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
  (accessToken, refreshToken, profile, done) => {
    // Store user information in MongoDB
    // Adjust the User model according to your needs
    const User = mongoose.model('User', new mongoose.Schema({
      githubId: String,
      username: String,
      displayName: String,
      // Add more fields as needed
    }));

    User.findOneAndUpdate({ githubId: profile.id }, {
      githubId: profile.id,
      username: profile.username,
      displayName: profile.displayName,
    }, { upsert: true, new: true }, (err, user) => {
      return done(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const User = mongoose.model('User');
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Routes
const surveyRoutes = require('./routes/surveyroutes');
app.use('/surveys', surveyRoutes);

// Define a route for the home page
app.get('/', (req, res) => {
  res.render('home'); // Renders the home.ejs as the landing page
});

// ...any additional routes or error handling
