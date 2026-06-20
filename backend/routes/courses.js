const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    let enrollment = await Enrollment.findOne({ userId: req.user.id, courseId: req.params.id });
    if (enrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    enrollment = new Enrollment({
      userId: req.user.id,
      courseId: req.params.id
    });
    await enrollment.save();
    
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalCourses: 1 } });
    
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:courseId/lessons/:lessonId/complete', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId: req.params.courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }
    
    if (!enrollment.completedLessons.includes(req.params.lessonId)) {
      enrollment.completedLessons.push(req.params.lessonId);
      
      const course = await Course.findById(req.params.courseId);
      enrollment.progress = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);
      
      await enrollment.save();
    }
    
    res.json({ message: 'Lesson completed', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
