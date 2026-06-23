/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management
 */

const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for current user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notes
 */
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/notes/course/{courseId}/lesson/{lessonId}:
 *   get:
 *     summary: Get note for a specific lesson
 *     tags: [Notes]
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
 *         description: Note content
 */
router.get('/course/:courseId/lesson/:lessonId', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      userId: req.user.id,
      courseId: req.params.courseId,
      lessonId: req.params.lessonId
    });
    res.json(note || { content: '' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create or update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lessonId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Saved note
 */
router.post('/', auth, async (req, res) => {
  try {
    const { lessonId, courseId, content } = req.body;
    
    let note = await Note.findOne({
      userId: req.user.id,
      courseId,
      lessonId
    });
    
    if (note) {
      note.content = content;
      note.updatedAt = Date.now();
    } else {
      note = new Note({
        userId: req.user.id,
        lessonId,
        courseId,
        content
      });
    }
    
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
