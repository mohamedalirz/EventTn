const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes require ADMIN role
router.use(authMiddleware, roleMiddleware('ADMIN'));

router.get('/users', adminController.getAllUsers);
router.get('/events', adminController.getAllEvents);
router.get('/sponsorships', adminController.getAllSponsorships);

router.delete('/users/:id', adminController.deleteUser);
router.delete('/events/:id', adminController.deleteEvent);

module.exports = router;
