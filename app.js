// app.js

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Connect to MongoDB and start the server within the connection callback
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
const authRoutes = require('./routes/authroutes');

app.use('/surveys', surveyRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// ...any additional routes or error handling
