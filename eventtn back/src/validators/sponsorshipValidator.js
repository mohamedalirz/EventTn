const { body } = require('express-validator');

const createSponsorshipValidator = [
  body('eventId')
    .trim()
    .notEmpty().withMessage('Event ID is required'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 5, max: 1000 }).withMessage('Message must be between 5 and 1000 characters'),
];

const updateSponsorshipValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['ACCEPTED', 'REJECTED', 'PENDING']).withMessage('Status must be PENDING, ACCEPTED or REJECTED'),
];

module.exports = { createSponsorshipValidator, updateSponsorshipValidator };
