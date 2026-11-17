const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { email, password, role, name, companyName } = req.body;
    const result = await authService.register({ email, password, role, name, companyName });
    return successResponse(res, 'User registered successfully', result, 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return successResponse(res, 'Login successful', result, 200);
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    return successResponse(res, 'Current user retrieved', user, 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  register,
  login,
  getMe
};
