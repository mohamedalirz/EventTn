/**
 * Wraps async controller functions so any thrown/rejected error
 * is forwarded to the Express error-handling middleware.
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
