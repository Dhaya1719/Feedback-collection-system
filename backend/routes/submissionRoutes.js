const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');
const Form = require('../models/form');
const auth = require('../middleware/auth');

// @route   POST /api/submissions/:formId
// @desc    Submit a feedback form response
// @access  Public
router.post('/:formId', async (req, res) => {
  const { name, email, ...responses } = req.body; // Capture dynamic responses
  try {
    const newSubmission = new Submission({
      formId: req.params.formId,
      name,
      email,
      responses
    });
    const submission = await newSubmission.save();
    res.json(submission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/submissions/analytics/:formId
// @desc    Get processed analytics for a form
// @access  Private
router.get('/analytics/:formId', auth, async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    
    // Authorization check (optional but recommended): Ensure the admin owns the form
    if (form.adminId.toString() !== req.admin.id) {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const submissions = await Submission.find({ formId: req.params.formId });
    const totalSubmissions = submissions.length;
    const analyticsData = {};

    form.questions.forEach((q, index) => {
      // Create a stable key from the question's MongoDB ID for reliable tracking
      const questionKey = q._id.toString(); 
      
      const questionAnalysis = {
        questionText: q.questionText,
        questionType: q.questionType,
        totalResponses: totalSubmissions,
        data: {}
      };

      if (q.questionType === 'rating') {
        let sum = 0;
        let count = 0;
        const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        
        submissions.forEach(sub => {
          const rating = Number(sub.responses[questionKey]);
          if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            sum += rating;
            count++;
            starCounts[rating] = starCounts[rating] + 1;
          }
        });

        questionAnalysis.data.average = (count > 0 ? sum / count : 0).toFixed(2);
        questionAnalysis.data.distribution = starCounts;
        
      } else if (q.questionType === 'radio' || q.questionType === 'checkbox') {
        const optionCounts = {};
        q.options.forEach(opt => optionCounts[opt] = 0);

        submissions.forEach(sub => {
          const response = sub.responses[questionKey];
          if (response) {
            const responsesArray = Array.isArray(response) ? response : [response];
            responsesArray.forEach(r => {
              if (optionCounts.hasOwnProperty(r)) {
                optionCounts[r]++;
              }
            });
          }
        });
        questionAnalysis.data.counts = optionCounts;

      } else if (q.questionType === 'text') {
        questionAnalysis.data.comments = submissions
          .map(sub => sub.responses[questionKey])
          .filter(c => c && c.trim() !== '');
      }

      analyticsData[questionKey] = questionAnalysis;
    });

    res.json({ formTitle: form.title, analytics: analyticsData, totalSubmissions });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;