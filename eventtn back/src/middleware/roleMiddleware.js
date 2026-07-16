const AppError = require('../utils/AppError');

/**
 * Restricts access to the given roles.
 * Usage: roleMiddleware('ADMIN', 'ORGANIZER')
 */
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('You are not logged in.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    next();
  };
};

module.exports = roleMiddleware;
