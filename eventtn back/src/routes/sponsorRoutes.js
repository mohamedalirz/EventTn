const express = require('express');
const sponsorController = require('../controllers/sponsorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/events',
  authMiddleware,
  roleMiddleware('SPONSOR'),
  sponsorController.browseEvents
);

module.exports = router;
