const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { createEventValidator, updateEventValidator } = require('../validators/eventValidator');
const { upload, uploadBufferToCloudinary } = require('../config/upload');

const router = express.Router();

// Public routes
router.get('/', eventController.getAllEvents);

// Protected - organizer's own events (must be before /:id to avoid collision)
router.get(
  '/organizer/my-events',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  eventController.getMyEvents
);

router.get('/:id', eventController.getEventById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  upload.single('banner'),
  uploadBufferToCloudinary,
  createEventValidator,
  validateMiddleware,
  eventController.createEvent
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER', 'ADMIN'),
  upload.single('banner'),
  uploadBufferToCloudinary,
  updateEventValidator,
  validateMiddleware,
  eventController.updateEvent
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER', 'ADMIN'),
  eventController.deleteEvent
);

module.exports = router;
