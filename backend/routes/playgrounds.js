/**
 * @swagger
 * tags:
 *   name: Playgrounds
 *   description: Playground project management
 */

const express = require('express');
const Playground = require('../models/Playground');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/playgrounds:
 *   get:
 *     summary: Get all playground projects for current user
 *     tags: [Playgrounds]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of playground projects
 */

// Get all playground projects for current user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Playground.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get playground projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/playgrounds/{id}:
 *   get:
 *     summary: Get a specific playground project
 *     tags: [Playgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Playground project details
 *       404:
 *         description: Project not found
 */

// Get a specific playground project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Playground.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get playground project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/playgrounds:
 *   post:
 *     summary: Create a new playground project
 *     tags: [Playgrounds]
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
 *               html:
 *                 type: string
 *               css:
 *                 type: string
 *               js:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created playground project
 */

// Create a new playground project
router.post('/', auth, async (req, res) => {
  try {
    const { title, html, css, js } = req.body;

    const newProject = new Playground({
      title,
      html,
      css,
      js,
      user: req.user.id
    });

    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (error) {
    console.error('Create playground project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/playgrounds/{id}:
 *   put:
 *     summary: Update a playground project
 *     tags: [Playgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               html:
 *                 type: string
 *               css:
 *                 type: string
 *               js:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated playground project
 *       404:
 *         description: Project not found
 */

// Update a playground project
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, html, css, js } = req.body;

    const project = await Playground.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.title = title || project.title;
    project.html = html !== undefined ? html : project.html;
    project.css = css !== undefined ? css : project.css;
    project.js = js !== undefined ? js : project.js;
    project.updatedAt = Date.now();

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Update playground project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/playgrounds/{id}:
 *   delete:
 *     summary: Delete a playground project
 *     tags: [Playgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */

// Delete a playground project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Playground.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete playground project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
