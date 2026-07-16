const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');
const adminService = require('../services/adminService');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await adminService.getAllUsers();
  return success(res, 200, 'Users fetched successfully', { users, count: users.length });
});

const getAllEvents = catchAsync(async (req, res) => {
  const events = await adminService.getAllEvents();
  return success(res, 200, 'Events fetched successfully', { events, count: events.length });
});

const getAllSponsorships = catchAsync(async (req, res) => {
  const sponsorships = await adminService.getAllSponsorships();
  return success(res, 200, 'Sponsorship requests fetched successfully', {
    sponsorships,
    count: sponsorships.length,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  return success(res, 200, 'User deleted successfully', null);
});

const deleteEvent = catchAsync(async (req, res) => {
  await adminService.deleteEvent(req.params.id);
  return success(res, 200, 'Event deleted successfully', null);
});

module.exports = {
  getAllUsers,
  getAllEvents,
  getAllSponsorships,
  deleteUser,
  deleteEvent,
};
