const express = require('express');

const authRoutes = require('./authRoutes');
const eventRoutes = require('./eventRoutes');
const sponsorRoutes = require('./sponsorRoutes');
const sponsorshipRoutes = require('./sponsorshipRoutes');
const organizerRoutes = require('./organizerRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/sponsors', sponsorRoutes);
router.use('/sponsorships', sponsorshipRoutes);
router.use('/organizer', organizerRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
