const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { upload } = require('../config/multer');
const { profileValidation } = require('../validations/profileValidation');
const { validate } = require('../middleware/validate');

router.use(authenticateJwt);
router.use(requireRole('candidate'));

router.get('/profile', candidateController.getProfile);
router.put('/profile', profileValidation, validate, candidateController.updateProfile);
router.post('/resume', upload.single('resume'), candidateController.uploadResume);
router.get('/dashboard', candidateController.getDashboard);
router.post('/apply/:jobId', candidateController.applyJob);
router.get('/applications', candidateController.getApplications);

module.exports = router;
