const Survey = require('../models/survey'); // Import the Survey model

// Display list of all surveys
exports.listSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.render('surveys/list-survey', { surveys });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Display detail page for a specific survey
exports.surveyDetail = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/survey-detail', { survey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Display survey create form on GET
exports.surveyCreateGet = (req, res) => {
  res.render('surveys/new-survey');
};

// Handle survey create on POST
exports.surveyCreatePost = async (req, res) => {
  try {
    const survey = new Survey({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions, // Make sure to structure the questions input correctly on the client-side
    });
    await survey.save();
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Display survey delete form on GET
exports.surveyDeleteGet = async (req, res) => {
  try {
    await Survey.findByIdAndRemove(req.params.id);
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Display survey update form on GET
exports.surveyUpdateGet = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/edit-survey', { survey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Handle survey update on POST
exports.surveyUpdatePost = async (req, res) => {
  try {
    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        questions: req.body.questions, // Adjust this based on your form structure
      },
      { new: true } // This option ensures that the function returns the updated survey
    );

    if (!updatedSurvey) {
      return res.status(404).send('Survey not found');
    }

    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
