const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      optionText: {
        type: String,
        required: true
      }
    }]
  }],
  responses: [{
    questionText: String,
    response: {
      type: [String],
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;
