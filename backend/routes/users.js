const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, about, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, about, avatar },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update activity
router.put('/activity', auth, async (req, res) => {
  try {
    const { day, hours, description } = req.body;
    const user = await User.findById(req.user.id);
    
    const existingDay = user.activityData.find(d => d.day === day);
    if (existingDay) {
      existingDay.hours += hours;
      if (description) existingDay.description = description;
    } else {
      user.activityData.push({ day, hours, description: description || '' });
    }
    
    user.totalHours += hours;
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add recent activity
router.post('/activity/recent', auth, async (req, res) => {
  try {
    const { type, description } = req.body;
    const user = await User.findById(req.user.id);
    
    user.recentActivity.unshift({ type, description });
    
    // Keep only last 10 activities
    if (user.recentActivity.length > 10) {
      user.recentActivity = user.recentActivity.slice(0, 10);
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Add recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all skills
router.get('/skills', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a skill
router.post('/skills', auth, async (req, res) => {
  try {
    const { skill } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
    }
    
    await user.save();
    res.json(user.skills);
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a skill
router.delete('/skills/:skill', auth, async (req, res) => {
  try {
    const { skill } = req.params;
    const user = await User.findById(req.user.id);
    
    user.skills = user.skills.filter(s => s !== skill);
    
    await user.save();
    res.json(user.skills);
  } catch (error) {
    console.error('Remove skill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add an achievement
router.post('/achievements', auth, async (req, res) => {
  try {
    const { title, icon, color } = req.body;
    const user = await User.findById(req.user.id);
    
    user.achievements.push({ title, icon, color });
    
    // Add points for achievement
    user.points += 100;
    
    await user.save();
    res.json(user.achievements);
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a certificate
router.post('/certificates', auth, async (req, res) => {
  try {
    const { courseId, courseTitle, certificateUrl } = req.body;
    const user = await User.findById(req.user.id);
    
    user.certificates.push({ courseId, courseTitle, certificateUrl });
    
    // Add points for certificate
    user.points += 500;
    
    await user.save();
    res.json(user.certificates);
  } catch (error) {
    console.error('Add certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
