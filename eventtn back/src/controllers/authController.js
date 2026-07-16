const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');
const authService = require('../services/authService');

const register = catchAsync(async (req, res) => {
  const { fullname, email, password, role } = req.body;

  const { user, token } = await authService.register({ fullname, email, password, role });

  return success(res, 201, 'Account created successfully', { user, token });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  return success(res, 200, 'Logged in successfully', { user, token });
});

const getMe = catchAsync(async (req, res) => {
  return success(res, 200, 'Current user fetched successfully', { user: req.user });
});

module.exports = { register, login, getMe };
