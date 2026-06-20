const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

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
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/activity', auth, async (req, res) => {
  try {
    const { day, hours } = req.body;
    const user = await User.findById(req.user.id);
    
    const existingDay = user.activityData.find(d => d.day === day);
    if (existingDay) {
      existingDay.hours += hours;
    } else {
      user.activityData.push({ day, hours });
    }
    
    user.totalHours += hours;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
