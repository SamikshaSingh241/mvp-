const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJwt } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { verifyCompanyValidation } = require('../validations/companyValidation');
const { validate } = require('../middleware/validate');

router.use(authenticateJwt);
router.use(requireRole('admin'));

router.get('/companies', adminController.getCompanies);
router.patch('/companies/:id/verify', verifyCompanyValidation, validate, adminController.verifyCompany);
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
