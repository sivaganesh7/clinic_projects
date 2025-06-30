const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, feedbackController.submitFeedback);
router.get('/patient/me', authMiddleware, feedbackController.getPatientFeedbacks);

module.exports = router;
