const express = require('express');
const UserController = require('../controllers/UserController');
const { validatePagination } = require('../utils/validation');

const router = express.Router();

// Profile routes
router.post('/profile', UserController.createProfile);
router.get('/profile/:walletAddress', UserController.getProfile);
router.put('/profile/:walletAddress', UserController.updateProfile);

// Search and discovery
router.get('/search', UserController.searchUsers);
router.get('/leaderboard', UserController.getLeaderboard);

// Badges
router.get('/:walletAddress/badges', UserController.getUserBadges);

// Events
router.get('/:walletAddress/events', UserController.getUserEvents);

// Points management
router.post('/:walletAddress/points', UserController.awardPoints);

// Connections
router.get('/:walletAddress/connections', UserController.getConnections);
router.post('/:walletAddress/connection-request', UserController.sendConnectionRequest);
router.post('/:walletAddress/accept-connection', UserController.acceptConnectionRequest);

module.exports = router;