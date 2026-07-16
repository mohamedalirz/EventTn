const express = require('express');
const sponsorshipController = require('../controllers/sponsorshipController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Organizer views sponsorship requests made to their events
router.get(
  '/sponsorships',
  authMiddleware,
  roleMiddleware('ORGANIZER'),
  sponsorshipController.getOrganizerSponsorshipRequests
);

module.exports = router;
