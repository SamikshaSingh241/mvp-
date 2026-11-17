const candidateService = require('../services/candidateService');
const fileStorageService = require('../services/fileStorageService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    const data = await candidateService.getProfile(req.user._id);
    return successResponse(res, 'Candidate profile retrieved', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await candidateService.updateProfile(req.user._id, req.body);
    return successResponse(res, 'Candidate profile updated successfully', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No resume file uploaded', 400);
    }

    const fileUrl = fileStorageService.getFileUrl(req, req.file);
    const data = await candidateService.updateResume(req.user._id, req.file, fileUrl);
    return successResponse(res, 'Resume uploaded successfully', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await candidateService.getDashboardData(req.user._id);
    return successResponse(res, 'Candidate dashboard data retrieved', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const applyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { notes } = req.body;
    const application = await candidateService.applyToJob(req.user._id, jobId, notes);
    return successResponse(res, 'Application submitted successfully', application, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await candidateService.getApplications(req.user._id);
    return successResponse(res, 'Candidate applications retrieved', applications);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getDashboard,
  applyJob,
  getApplications
};
