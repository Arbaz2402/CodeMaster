const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

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
