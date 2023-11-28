const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const surveyRoutes = require('./routes/surveyroutes');

dotenv.config();

const app = express();

app.use(session({
  secret: 'some_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 } // this is the key
}))

app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use('/surveys', surveyRoutes);

// MongoDB connection
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully.');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Passport LocalStrategy
passport.use(new LocalStrategy(
  async function (username, password, done) {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Registration route
app.get('/register', (req, res) => {
  res.render('auth/register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    req.flash('error', 'Error registering user.');
    res.render('auth/register', { error: 'Error registering user.' });
  }
});

// Login route
app.get('/login', (req, res) => {
  res.render('auth/login', { messages: req.flash() });
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

// Home route
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('home', { user: req.user });
  } else {
    res.render('auth/login');
  }
});
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
