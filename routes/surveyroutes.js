const express = require('express');
const router = express.Router();
<<<<<<< Updated upstream
// const surveyController = require('./surveycontroller');
const surveyController = require('./surveycontroller');
// Route to display all surveys
=======
const passport = require('passport');
const surveyController = require('./surveycontroller');
const Survey = require('../models/survey'); // Adjust the path accordingly

>>>>>>> Stashed changes
router.get('/', surveyController.listSurveys);

router.get('/new', surveyController.surveyCreateGet);

router.post('/', surveyController.surveyCreatePost);

router.get('/:id', surveyController.surveyDetail);

router.get('/:id/edit', surveyController.surveyUpdateGet);

router.put('/:id', surveyController.surveyUpdatePost);

<<<<<<< Updated upstream
// Route to handle the deletion of a survey
router.delete('/:id', surveyController.surveyDeleteGet);

=======
router.delete('/:id', async (req, res) => {
    // Your delete logic goes here
});
>>>>>>> Stashed changes

// Corrected login route
router.get('/login', (req, res) => {
    console.log('Login route hit');
    res.render('login');
});

router.get('/login/github', passport.authenticate('github'));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    });

module.exports = router;
