const mongoose = require('mongoose');

const playgroundSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Untitled Project'
  },
  html: {
    type: String,
    default: ''
  },
  css: {
    type: String,
    default: ''
  },
  js: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Playground', playgroundSchema);
