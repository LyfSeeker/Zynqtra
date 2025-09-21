const express = require('express');
const userRoutes = require('./users');
const eventRoutes = require('./events');
const badgeRoutes = require('./badges');
const uploadRoutes = require('./upload');

const router = express.Router();

// API version
router.get('/', (req, res) => {
  res.json({
    message: 'Zynqtra Backend API v1',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      events: '/api/events', 
      badges: '/api/badges',
      upload: '/api/upload',
    },
  });
});

// Mount route modules
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/badges', badgeRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;