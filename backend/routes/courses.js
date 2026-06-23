/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *       500:
 *         description: Server error
 */

router.get('/', async (req, res) => {
  try {
    let courses = await Course.find();
    // Map img to image and lesson url to videoUrl for backwards compatibility
    courses = courses.map(course => {
      const courseObj = course.toObject();
      if (courseObj.img && !courseObj.image) {
        courseObj.image = courseObj.img;
      }
      // Fix lessons
      if (courseObj.lessons && courseObj.lessons.length) {
        courseObj.lessons = courseObj.lessons.map(lesson => {
          if (lesson.url && !lesson.videoUrl) {
            lesson.videoUrl = lesson.url;
          }
          return lesson;
        });
      }
      return courseObj;
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a single course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get('/:id', async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // Map img to image and lesson url to videoUrl for backwards compatibility
    const courseObj = course.toObject();
    if (courseObj.img && !courseObj.image) {
      courseObj.image = courseObj.img;
    }
    // Fix lessons
    if (courseObj.lessons && courseObj.lessons.length) {
      courseObj.lessons = courseObj.lessons.map(lesson => {
        if (lesson.url && !lesson.videoUrl) {
          lesson.videoUrl = lesson.url;
        }
        return lesson;
      });
    }
    res.json(courseObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/courses/{id}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrolled successfully
 *       400:
 *         description: Already enrolled
 *       404:
 *         description: Course not found
 */
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

/**
 * @swagger
 * /api/courses/user/enrolled:
 *   get:
 *     summary: Get enrolled courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrolled courses
 */
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id }).populate('courseId');
    // Map to frontend-friendly format and fix fields
    const formattedEnrollments = enrollments.map(e => {
      let courseObj = e.courseId.toObject();
      // Fix image field
      if (courseObj.img && !courseObj.image) {
        courseObj.image = courseObj.img;
      }
      // Fix lessons
      if (courseObj.lessons && courseObj.lessons.length) {
        courseObj.lessons = courseObj.lessons.map(lesson => {
          if (lesson.url && !lesson.videoUrl) {
            lesson.videoUrl = lesson.url;
          }
          return lesson;
        });
      }
      return {
        ...e._doc,
        course: courseObj
      };
    });
    res.json(formattedEnrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/courses/{courseId}/lessons/{lessonId}/complete:
 *   put:
 *     summary: Mark lesson as complete/incomplete
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson completion updated
 *       404:
 *         description: Not enrolled
 */
router.put('/:courseId/lessons/:lessonId/complete', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user.id, courseId: req.params.courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }
    
    const lessonIndex = enrollment.completedLessons.indexOf(req.params.lessonId);
    if (lessonIndex > -1) {
      // Remove from completed
      enrollment.completedLessons.splice(lessonIndex, 1);
    } else {
      // Add to completed
      enrollment.completedLessons.push(req.params.lessonId);
    }
    
    const course = await Course.findById(req.params.courseId);
    enrollment.progress = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);
    
    await enrollment.save();
    
    res.json({ message: 'Lesson completion updated', enrollment });
  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
