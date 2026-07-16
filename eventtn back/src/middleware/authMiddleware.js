const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const prisma = require('../config/db');

/**
 * Verifies the JWT from the Authorization header and attaches
 * the authenticated user (minus password) to req.user
 */
const authMiddleware = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('You are not logged in. Please log in to access this resource.', 401));
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, fullname: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
