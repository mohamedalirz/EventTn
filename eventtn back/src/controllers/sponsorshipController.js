const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');
const sponsorshipService = require('../services/sponsorshipService');

// POST /api/sponsorships - sponsor creates a request
const createSponsorshipRequest = catchAsync(async (req, res) => {
  const { eventId, message } = req.body;

  const request = await sponsorshipService.createSponsorshipRequest({
    sponsorId: req.user.id,
    eventId,
    message,
  });

  return success(res, 201, 'Sponsorship request sent successfully', { request });
});

// GET /api/sponsorships/my - sponsor views own requests
const getMySponsorshipRequests = catchAsync(async (req, res) => {
  const requests = await sponsorshipService.getMySponsorshipRequests(req.user.id);

  return success(res, 200, 'Your sponsorship requests fetched successfully', {
    requests,
    count: requests.length,
  });
});

// GET /api/organizer/sponsorships - organizer views requests for their events
const getOrganizerSponsorshipRequests = catchAsync(async (req, res) => {
  const requests = await sponsorshipService.getOrganizerSponsorshipRequests(req.user.id);

  return success(res, 200, 'Sponsorship requests fetched successfully', {
    requests,
    count: requests.length,
  });
});

// PATCH /api/sponsorships/:id - organizer accepts/rejects
const updateSponsorshipStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  const request = await sponsorshipService.updateSponsorshipStatus(req.params.id, status, req.user);

  return success(res, 200, 'Sponsorship request updated successfully', { request });
});

module.exports = {
  createSponsorshipRequest,
  getMySponsorshipRequests,
  getOrganizerSponsorshipRequests,
  updateSponsorshipStatus,
};
