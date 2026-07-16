const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');
const eventService = require('../services/eventService');

// GET /api/sponsors/events - sponsors browse all events
const browseEvents = catchAsync(async (req, res) => {
  const { category, city, featured, search } = req.query;
  const events = await eventService.getAllEvents({ category, city, featured, search });

  return success(res, 200, 'Events fetched successfully', { events, count: events.length });
});

module.exports = { browseEvents };
