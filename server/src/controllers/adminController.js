const adminService = require('../services/adminService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCompanies = async (req, res, next) => {
  try {
    const { status } = req.query;
    const companies = await adminService.getCompanies(status);
    return successResponse(res, 'Companies retrieved for moderation', companies);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const verifyCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    const company = await adminService.verifyCompany(req.user._id, id, { status, adminNote });
    return successResponse(
      res,
      `Company status successfully updated to '${status}'`,
      company
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getAdminDashboardMetrics();
    return successResponse(res, 'Admin dashboard metrics retrieved', data);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  getCompanies,
  verifyCompany,
  getDashboard
};
