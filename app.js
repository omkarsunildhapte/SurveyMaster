const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const passport = require('passport');
<<<<<<< Updated upstream
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
=======
const GitHubStrategy = require('passport-github').Strategy; // Add GitHubStrategy
const session = require('express-session');
const User = require('./models/user');
>>>>>>> Stashed changes

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

<<<<<<< Updated upstream
// Connect to MongoDB and start the server within the connection callback
=======
// Set up session middleware
app.use(session({ secret: 'b9e4d8b6a1777d83cfbffcbeab7ac69f5d04e29d2a00007c7808bb787c384a0c', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
// Passport configuration
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

=======
>>>>>>> Stashed changes
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
<<<<<<< Updated upstream
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
=======
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });

  }));
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists in your database
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      return done(null, existingUser);
    } else {
      // If the user doesn't exist, create a new user in the database
      const newUser = new User({
        googleId: profile.id,
        username: profile.displayName,
        // Add other user properties as needed
      });

      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    return done(err);
  }
}));
// Serialize and deserialize user
app.get('/login/github', passport.authenticate('github'));

// GitHub callback route
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile'));

app.get('/login/google', passport.authenticate('google', { scope: ['profile'] }));

// Google callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile'));
// Profile route
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/login');
  }
>>>>>>> Stashed changes
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// GitHub login route
app.get('/login/github', passport.authenticate('github'));

// GitHub callback route
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile'));

// Simple login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Home route
app.get('/', (req, res) => {
  res.render('home');
});
