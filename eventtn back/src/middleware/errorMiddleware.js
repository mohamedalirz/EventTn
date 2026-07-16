const { error } = require('../utils/response');

/**
 * Centralized error-handling middleware.
 * Catches AppError instances, Prisma errors, Multer errors, and generic errors.
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Prisma known request errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate value for field: ${err.meta?.target?.join(', ') || 'unique field'}`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Invalid reference to related record';
  }

  // Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  // JSON body parse errors
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err);
  }

  return error(res, statusCode, message, errors);
};

module.exports = errorMiddleware;
