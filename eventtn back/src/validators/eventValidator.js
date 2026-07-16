const { body } = require('express-validator');

const createEventValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),

  body('venue')
    .trim()
    .notEmpty().withMessage('Venue is required'),

  body('eventDate')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Event date must be a valid date'),

  body('ticketPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Ticket price must be a positive number'),

  body('totalTickets')
    .optional()
    .isInt({ min: 0 }).withMessage('Total tickets must be a positive integer'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
];

const updateEventValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 }).withMessage('Title must be between 3 and 150 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),

  body('eventDate')
    .optional()
    .isISO8601().withMessage('Event date must be a valid date'),

  body('ticketPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Ticket price must be a positive number'),

  body('totalTickets')
    .optional()
    .isInt({ min: 0 }).withMessage('Total tickets must be a positive integer'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean'),
];

module.exports = { createEventValidator, updateEventValidator };
