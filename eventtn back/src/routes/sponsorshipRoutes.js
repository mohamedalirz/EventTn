const express = require('express');
const sponsorshipController = require('../controllers/sponsorshipController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const {
  createSponsorshipValidator,
  updateSponsorshipValidator,
} = require('../validators/sponsorshipValidator');

const router = express.Router();

// Sponsor creates a sponsorship request
router.post(
  '/',
  authMiddleware,
  roleMiddleware('SPONSOR'),
  createSponsorshipValidator,
  validateMiddleware,
  sponsorshipController.createSponsorshipRequest
);

// Sponsor views their own requests
router.get(
  '/my',
  authMiddleware,
  roleMiddleware('SPONSOR'),
  sponsorshipController.getMySponsorshipRequests
);

// Organizer accepts/rejects a request
router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('ORGANIZER', 'ADMIN'),
  updateSponsorshipValidator,
  validateMiddleware,
  sponsorshipController.updateSponsorshipStatus
);

module.exports = router;
