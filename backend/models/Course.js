const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  videoUrl: { type: String, required: true },
  url: { type: String, required: false },
  order: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  students: {
    type: String,
    default: '0'
  },
  price: {
    type: Number,
    required: true
  },
  image: {
        type: String,
        required: true
      },
      img: {
        type: String,
        required: false
      },
  desc: {
    type: String,
    required: true
  },
  learningKey: {
    type: String,
    required: true
  },
  lessons: [lessonSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
