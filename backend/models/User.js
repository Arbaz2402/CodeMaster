const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  streak: {
    type: Number,
    default: 0
  },
  totalCourses: {
    type: Number,
    default: 0
  },
  totalHours: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  activityData: [{
    day: { type: String, required: true },
    hours: { type: Number, default: 0 }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
