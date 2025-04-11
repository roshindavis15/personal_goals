const mongoose = require('mongoose');
const mongooseFuzzySearching = require('mongoose-fuzzy-searching');

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reflections: [{
    question: String,
    answer: String
  }],
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add fuzzy searching for the search feature
journalSchema.plugin(mongooseFuzzySearching, { fields: ['title', 'content'] });

module.exports = mongoose.model('Journal', journalSchema);