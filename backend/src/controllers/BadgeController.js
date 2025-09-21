const BadgeModel = require('../models/Badge');
const UserModel = require('../models/User');
const { validateBadge } = require('../utils/validation');
const { handleAsync } = require('../utils/errorHandler');

class BadgeController {
  // Create new badge
  static createBadge = handleAsync(async (req, res) => {
    const { error, value } = validateBadge(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message),
      });
    }

    const badge = await BadgeModel.create(value);
    
    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      data: badge,
    });
  });

  // Get badge by ID
  static getBadge = handleAsync(async (req, res) => {
    const { badgeId } = req.params;
    
    const badge = await BadgeModel.getBadgeWithMetadata(badgeId);
    
    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    res.json({
      success: true,
      data: badge,
    });
  });

  // Get all badges with filters
  static getBadges = handleAsync(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      rarity,
      badgeType,
      isActive,
    } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    if (rarity) filters.rarity = rarity;
    if (badgeType !== undefined) filters.badgeType = parseInt(badgeType);
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    const result = await BadgeModel.getBadges(filters);
    
    res.json({
      success: true,
      data: result,
    });
  });

  // Award badge to user
  static awardBadge = handleAsync(async (req, res) => {
    const { badgeId } = req.params;
    const { walletAddress, source = 'manual' } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }

    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userBadge = await BadgeModel.awardToUser(badgeId, user.id, source);
    
    // Emit socket event to notify the user
    const io = req.app.get('io');
    io.to(walletAddress).emit('badge_awarded', {
      badge: userBadge.badge,
      awardedAt: userBadge.awardedAt,
      source: userBadge.source,
      pointsEarned: userBadge.pointsEarned,
    });

    res.json({
      success: true,
      message: 'Badge awarded successfully',
      data: userBadge,
    });
  });

  // Get user's badges
  static getUserBadges = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    
    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const badges = await BadgeModel.getUserBadges(user.id);
    
    res.json({
      success: true,
      data: badges,
    });
  });

  // Check user badge eligibility
  static checkEligibility = handleAsync(async (req, res) => {
    const { badgeId, walletAddress } = req.params;
    
    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isEligible = await BadgeModel.checkUserEligibility(user.id, badgeId);
    const badge = await BadgeModel.findById(badgeId);
    
    res.json({
      success: true,
      data: {
        badgeId,
        badgeName: badge?.name,
        isEligible,
        userPoints: user.totalPoints,
        requiredPoints: badge?.pointsRequired,
        reason: isEligible ? 'User meets all requirements' : 
               !badge ? 'Badge not found' :
               user.totalPoints < badge.pointsRequired ? 'Insufficient points' :
               'User already has this badge',
      },
    });
  });

  // Get badges by rarity
  static getBadgesByRarity = handleAsync(async (req, res) => {
    const { rarity } = req.params;
    
    const validRarities = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
    if (!validRarities.includes(rarity.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rarity level',
      });
    }

    const badges = await BadgeModel.getBadgesByRarity(rarity.toUpperCase());
    
    res.json({
      success: true,
      data: badges,
    });
  });

  // Get badge statistics
  static getBadgeStats = handleAsync(async (req, res) => {
    const { badgeId } = req.params;
    
    const stats = await BadgeModel.getBadgeStats(badgeId);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found',
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  });

  // Update badge status
  static updateBadgeStatus = handleAsync(async (req, res) => {
    const { badgeId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value',
      });
    }

    const badge = await BadgeModel.updateStatus(badgeId, isActive);
    
    res.json({
      success: true,
      message: `Badge ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: badge,
    });
  });

  // Auto-award badges based on user achievements
  static autoAwardBadges = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    
    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get all active badges that user might be eligible for
    const { badges } = await BadgeModel.getBadges({
      page: 1,
      limit: 100,
      isActive: true,
    });

    const awardedBadges = [];
    const io = req.app.get('io');

    for (const badge of badges) {
      const isEligible = await BadgeModel.checkUserEligibility(user.id, badge.id);
      
      if (isEligible) {
        try {
          const userBadge = await BadgeModel.awardToUser(badge.id, user.id, 'auto-award');
          awardedBadges.push(userBadge);
          
          // Notify user
          io.to(walletAddress).emit('badge_awarded', {
            badge: userBadge.badge,
            awardedAt: userBadge.awardedAt,
            source: 'auto-award',
            pointsEarned: userBadge.pointsEarned,
          });
        } catch (error) {
          console.log(`Failed to auto-award badge ${badge.id} to user ${user.id}:`, error.message);
        }
      }
    }

    res.json({
      success: true,
      message: `Auto-awarded ${awardedBadges.length} badges`,
      data: awardedBadges,
    });
  });

  // Get badge leaderboard (users with most badges of specific rarity)
  static getBadgeLeaderboard = handleAsync(async (req, res) => {
    const { rarity, limit = 10 } = req.query;
    
    const prisma = require('../config/database');
    
    // Build query based on rarity filter
    const badgeFilter = rarity ? { rarity: rarity.toUpperCase() } : {};
    
    // Get users with badge counts
    const leaderboard = await prisma.user.findMany({
      select: {
        walletAddress: true,
        name: true,
        profileImageUrl: true,
        totalPoints: true,
        level: true,
        userBadges: {
          where: {
            badge: badgeFilter,
          },
          select: {
            id: true,
            badge: {
              select: {
                rarity: true,
              },
            },
          },
        },
      },
      orderBy: {
        totalPoints: 'desc',
      },
      take: parseInt(limit),
    });

    // Transform data to include badge counts
    const transformedLeaderboard = leaderboard
      .map(user => ({
        walletAddress: user.walletAddress,
        name: user.name,
        profileImageUrl: user.profileImageUrl,
        totalPoints: user.totalPoints,
        level: user.level,
        badgeCount: user.userBadges.length,
        rarityBreakdown: user.userBadges.reduce((acc, ub) => {
          const rarity = ub.badge.rarity;
          acc[rarity] = (acc[rarity] || 0) + 1;
          return acc;
        }, {}),
      }))
      .filter(user => user.badgeCount > 0)
      .sort((a, b) => b.badgeCount - a.badgeCount);

    res.json({
      success: true,
      data: transformedLeaderboard,
    });
  });
}

module.exports = BadgeController;