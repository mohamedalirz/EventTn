const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const AppError = require('./utils/AppError');

const app = express();

// Security & core middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Serve locally uploaded images (fallback when Cloudinary isn't configured)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventTN API is running',
    data: { version: '1.0.0' },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: { uptime: process.uptime() },
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
