const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, 'Validation Error', 400, messages);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `Duplicate field value entered for '${field}'. Please use another value.`, 400);
  }

  if (err.name === 'CastError') {
    return errorResponse(res, `Resource not found with id ${err.value}`, 404);
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File size exceeds 5MB limit. Please upload a smaller file.', 400);
    }
    return errorResponse(res, `File upload error: ${err.message}`, 400);
  }

  return errorResponse(res, err.message || 'Internal Server Error', err.statusCode || 500);
};

module.exports = { errorHandler };
