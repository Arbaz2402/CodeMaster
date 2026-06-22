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
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: {
    type: String,
    default: null
  },
  confirmationTokenExpires: {
    type: Date,
    default: null
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpires: {
    type: Date,
    default: null
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
  skills: [{
    type: String
  }],
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
  points: {
    type: Number,
    default: 0
  },
  achievements: [{
    title: { type: String, required: true },
    icon: { type: String, default: 'fa-medal' },
    color: { type: String, default: 'purple' },
    earnedAt: { type: Date, default: Date.now }
  }],
  certificates: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    courseTitle: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    certificateUrl: { type: String, default: '' }
  }],
  activityData: [{
    day: { type: String, required: true },
    hours: { type: Number, default: 0 },
    description: { type: String, default: '' }
  }],
  recentActivity: [{
    type: { type: String, enum: ['lesson', 'quiz', 'achievement', 'project'], required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
