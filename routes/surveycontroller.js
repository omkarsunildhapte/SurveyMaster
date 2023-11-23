const Survey = require('../models/survey');

exports.listSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.render('surveys/list-survey', { surveys });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.surveyDetail = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/survey-detail', { survey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.surveyCreateGet = (req, res) => {
  res.render('surveys/new-survey');
};

exports.surveyCreatePost = async (req, res) => {
  try {
    const survey = new Survey({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
    });
    await survey.save();
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.surveyDeleteGet = async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.surveyUpdateGet = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/edit-survey', { survey });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const surveyCreateGet = (req, res) => {
  res.render('survey_create'); // Replace 'survey_create' with the actual name of your view file
};
exports.surveyUpdatePost = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send(error.message);
  }
};