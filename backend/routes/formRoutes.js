const express = require('express');
const router = express.Router();
const Form = require('../models/form');
const auth = require('../middleware/auth');

// @route   POST /api/forms
// @desc    Create a new feedback form
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, questions } = req.body;
  try {
    const newForm = new Form({
      title,
      description,
      adminId: req.admin.id,
      questions
    });
    const form = await newForm.save();
    res.json(form);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/forms
// @desc    Get all available feedback forms
// @access  Public
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().select('title description _id');
    res.json(forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/forms/:id
// @desc    Get a single feedback form by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ msg: 'Form not found' });
    }
    res.json(form);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/forms/admin
// @desc    Get forms created by a specific admin
// @access  Private
router.get('/admin/myforms', auth, async (req, res) => {
  try {
    const forms = await Form.find({ adminId: req.admin.id });
    res.json(forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;