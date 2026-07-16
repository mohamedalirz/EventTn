const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/response');
const eventService = require('../services/eventService');
const { isCloudinaryConfigured } = require('../config/upload');

function resolveBannerPath(file) {
  if (!file) return undefined;
  // Cloudinary path is already a full secure_url (set by uploadBufferToCloudinary)
  if (isCloudinaryConfigured) return file.path;
  // Local disk storage: always expose a clean web path regardless of OS
  return `/uploads/${file.filename}`;
}

const getAllEvents = catchAsync(async (req, res) => {
  const { category, city, featured, search } = req.query;
  const events = await eventService.getAllEvents({ category, city, featured, search });

  return success(res, 200, 'Events fetched successfully', { events, count: events.length });
});

const getEventById = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);

  return success(res, 200, 'Event fetched successfully', { event });
});

const createEvent = catchAsync(async (req, res) => {
  const banner = req.file ? resolveBannerPath(req.file) : req.body.banner || null;

  const eventData = {
    title: req.body.title,
    description: req.body.description,
    banner,
    category: req.body.category,
    city: req.body.city,
    venue: req.body.venue,
    eventDate: new Date(req.body.eventDate),
    ticketPrice: parseFloat(req.body.ticketPrice) || 0,
    totalTickets: parseInt(req.body.totalTickets, 10) || 0,
    featured: req.body.featured === 'true' || req.body.featured === true || false,
  };

  const event = await eventService.createEvent(eventData, req.user.id);

  return success(res, 201, 'Event created successfully', { event });
});

const updateEvent = catchAsync(async (req, res) => {
  const updateData = {};

  const allowedFields = [
    'title', 'description', 'category', 'city', 'venue',
    'eventDate', 'ticketPrice', 'totalTickets', 'featured',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (updateData.eventDate) updateData.eventDate = new Date(updateData.eventDate);
  if (updateData.ticketPrice !== undefined) updateData.ticketPrice = parseFloat(updateData.ticketPrice);
  if (updateData.totalTickets !== undefined) updateData.totalTickets = parseInt(updateData.totalTickets, 10);
  if (updateData.featured !== undefined) updateData.featured = updateData.featured === 'true' || updateData.featured === true;

  if (req.file) {
    updateData.banner = resolveBannerPath(req.file);
  }

  const event = await eventService.updateEvent(req.params.id, updateData, req.user);

  return success(res, 200, 'Event updated successfully', { event });
});

const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user);

  return success(res, 200, 'Event deleted successfully', null);
});

const getMyEvents = catchAsync(async (req, res) => {
  const events = await eventService.getEventsByOrganizer(req.user.id);

  return success(res, 200, 'Your events fetched successfully', { events, count: events.length });
});

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
};
