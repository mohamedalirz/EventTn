const { validationResult } = require('express-validator');
const { error } = require('../utils/response');

/**
 * Runs after express-validator chains; if any validation failed,
 * responds with a standardized error JSON payload.
 */
const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return error(res, 400, 'Validation failed', formattedErrors);
  }

  next();
};

module.exports = validateMiddleware;
