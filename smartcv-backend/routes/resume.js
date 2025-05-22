const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume
} = require('../controllers/resumeController');

router.use(protect); // All resume routes require authentication

router.route('/')
  .post(createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

module.exports = router; 