const express = require('express');
const router = express.Router();
const passport = require('passport');
const surveyController = require('./surveycontroller');
const Survey = require('../models/survey'); // Adjust the path accordingly

router.get('/', surveyController.listSurveys);

// Route to display the form for creating a new survey
router.get('/new', surveyController.surveyCreateGet);

// Route to handle the form submission for creating a new survey
router.post('/', surveyController.surveyCreatePost);

// Route to display a single survey's detail
router.get('/:id', surveyController.surveyDetail);

// Route to display the form to edit an existing survey
router.get('/:id/edit', surveyController.surveyUpdateGet);

// Route to handle the form submission for updating an existing survey
router.put('/:id', surveyController.surveyUpdatePost);

router.delete('/:id', async (req, res) => {
    const surveyId = req.params.id;

    try {
        const deletedSurvey = await Survey.findByIdAndDelete(surveyId);

        if (deletedSurvey) {
            res.redirect('/surveys'); // Redirect to the survey list or another appropriate route
        } else {
            res.status(404).send('Survey not found');
        }
    } catch (error) {
        console.error('Error deleting survey:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display the login form
router.get('/login', (req, res) => {
    console.log('Login route hit');
    res.render('auth/login');
});

// Route to display the register form
router.get('/register', (req, res) => {
    console.log('Register route hit');
    res.render('auth/register');
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

module.exports = router;
