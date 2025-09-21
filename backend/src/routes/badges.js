const express = require('express');
const BadgeController = require('../controllers/BadgeController');

const router = express.Router();

// Badge CRUD operations
router.post('/', BadgeController.createBadge);
router.get('/', BadgeController.getBadges);
router.get('/:badgeId', BadgeController.getBadge);

// Badge management
router.put('/:badgeId/status', BadgeController.updateBadgeStatus);
router.get('/:badgeId/stats', BadgeController.getBadgeStats);

// Badge awards
router.post('/:badgeId/award', BadgeController.awardBadge);
router.get('/user/:walletAddress', BadgeController.getUserBadges);
router.get('/:badgeId/eligibility/:walletAddress', BadgeController.checkEligibility);
router.post('/user/:walletAddress/auto-award', BadgeController.autoAwardBadges);

// Badge filtering
router.get('/rarity/:rarity', BadgeController.getBadgesByRarity);
router.get('/leaderboard/badges', BadgeController.getBadgeLeaderboard);

module.exports = router;