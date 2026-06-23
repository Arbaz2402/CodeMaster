/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               about:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user profile
 */

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

/**
 * @swagger
 * /api/users/activity:
 *   put:
 *     summary: Update user activity
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               hours:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user activity
 */

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

/**
 * @swagger
 * /api/users/activity/recent:
 *   post:
 *     summary: Add recent activity
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added recent activity
 */

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

/**
 * @swagger
 * /api/users/skills:
 *   get:
 *     summary: Get user skills
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user skills
 */

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

/**
 * @swagger
 * /api/users/skills:
 *   post:
 *     summary: Add a skill
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skill:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated list of skills
 */

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

/**
 * @swagger
 * /api/users/skills/{skill}:
 *   delete:
 *     summary: Remove a skill
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: skill
 *         required: true
 *         schema:
 *           type: string
 *         description: Skill to remove
 *     responses:
 *       200:
 *         description: Updated list of skills
 */

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

/**
 * @swagger
 * /api/users/achievements:
 *   post:
 *     summary: Add an achievement
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated list of achievements
 */

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

/**
 * @swagger
 * /api/users/certificates:
 *   post:
 *     summary: Add a certificate
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               courseTitle:
 *                 type: string
 *               certificateUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated list of certificates
 */

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
