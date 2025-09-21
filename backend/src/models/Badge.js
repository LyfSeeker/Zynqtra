const prisma = require('../config/database');
const { uploadBadgeMetadata, getFromIPFS } = require('../services/ipfsService');
const { awardBadge } = require('../services/blockchainService');

class BadgeModel {
  // Create a new badge
  static async create(badgeData) {
    try {
      // First upload badge metadata to IPFS
      const ipfsResult = await uploadBadgeMetadata(badgeData);
      
      // Create badge in database
      const badge = await prisma.badge.create({
        data: {
          name: badgeData.name,
          description: badgeData.description,
          ipfsHash: ipfsResult.hash,
          imageUrl: badgeData.imageUrl,
          badgeType: badgeData.badgeType || 0,
          rarity: badgeData.rarity || 'COMMON',
          pointsRequired: badgeData.pointsRequired || 0,
          maxSupply: badgeData.maxSupply,
          isTransferable: badgeData.isTransferable !== false,
          creatorAddress: badgeData.creatorAddress,
        },
      });

      return badge;
    } catch (error) {
      console.error('Error creating badge:', error);
      throw error;
    }
  }

  // Find badge by ID
  static async findById(badgeId) {
    try {
      return await prisma.badge.findUnique({
        where: { id: badgeId },
        include: {
          userBadges: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  walletAddress: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error finding badge by ID:', error);
      throw error;
    }
  }

  // Get all badges with pagination and filters
  static async getBadges({
    page = 1,
    limit = 20,
    rarity = null,
    badgeType = null,
    isActive = true,
  } = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {};

      if (rarity) {
        where.rarity = rarity;
      }

      if (badgeType !== null) {
        where.badgeType = badgeType;
      }

      if (isActive !== null) {
        where.isActive = isActive;
      }

      const [badges, totalCount] = await Promise.all([
        prisma.badge.findMany({
          where,
          include: {
            userBadges: {
              select: {
                id: true,
                userId: true,
                awardedAt: true,
              },
            },
          },
          orderBy: [
            { rarity: 'desc' },
            { createdAt: 'desc' },
          ],
          skip,
          take: limit,
        }),
        prisma.badge.count({ where }),
      ]);

      return {
        badges,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error getting badges:', error);
      throw error;
    }
  }

  // Award badge to user
  static async awardToUser(badgeId, userId, source = 'manual') {
    try {
      const badge = await this.findById(badgeId);
      if (!badge) {
        throw new Error('Badge not found');
      }

      if (!badge.isActive) {
        throw new Error('Badge is not active');
      }

      // Check if badge has supply limit
      if (badge.maxSupply && badge.currentSupply >= badge.maxSupply) {
        throw new Error('Badge supply limit reached');
      }

      // Check if user already has this badge
      const existingUserBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId,
          },
        },
      });

      if (existingUserBadge) {
        throw new Error('User already has this badge');
      }

      // Get user for blockchain interaction
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Award badge in database
      const userBadge = await prisma.userBadge.create({
        data: {
          userId,
          badgeId,
          source,
          pointsEarned: badge.pointsRequired,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
            },
          },
          badge: true,
        },
      });

      // Update badge current supply
      await prisma.badge.update({
        where: { id: badgeId },
        data: {
          currentSupply: {
            increment: 1,
          },
        },
      });

      // Award badge on blockchain if badge has on-chain ID
      if (badge.badgeId) {
        try {
          const blockchainResult = await awardBadge(
            user.walletAddress,
            badge.badgeId,
            source
          );

          // Update user badge with blockchain details
          await prisma.userBadge.update({
            where: { id: userBadge.id },
            data: {
              txHash: blockchainResult.txHash,
              blockNumber: BigInt(blockchainResult.blockNumber || 0),
            },
          });
        } catch (blockchainError) {
          console.warn('Blockchain badge award failed:', blockchainError.message);
        }
      }

      // Award points to user
      if (badge.pointsRequired > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalPoints: {
              increment: badge.pointsRequired,
            },
          },
        });
      }

      return userBadge;
    } catch (error) {
      console.error('Error awarding badge to user:', error);
      throw error;
    }
  }

  // Get user's badges
  static async getUserBadges(userId) {
    try {
      const userBadges = await prisma.userBadge.findMany({
        where: { userId },
        include: {
          badge: true,
        },
        orderBy: {
          awardedAt: 'desc',
        },
      });

      return userBadges;
    } catch (error) {
      console.error('Error getting user badges:', error);
      throw error;
    }
  }

  // Get badge with IPFS metadata
  static async getBadgeWithMetadata(badgeId) {
    try {
      const badge = await this.findById(badgeId);
      if (!badge) {
        return null;
      }

      // If badge has IPFS hash, fetch metadata
      let ipfsMetadata = null;
      if (badge.ipfsHash) {
        try {
          ipfsMetadata = await getFromIPFS(badge.ipfsHash);
        } catch (ipfsError) {
          console.warn('Failed to fetch IPFS metadata:', ipfsError.message);
        }
      }

      return {
        ...badge,
        metadata: ipfsMetadata,
      };
    } catch (error) {
      console.error('Error getting badge with metadata:', error);
      throw error;
    }
  }

  // Check if user can earn badge (based on points)
  static async checkUserEligibility(userId, badgeId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const badge = await prisma.badge.findUnique({
        where: { id: badgeId },
      });

      if (!user || !badge) {
        return false;
      }

      // Check if user already has badge
      const existingBadge = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: {
            userId,
            badgeId,
          },
        },
      });

      if (existingBadge) {
        return false;
      }

      // Check points requirement
      return user.totalPoints >= badge.pointsRequired;
    } catch (error) {
      console.error('Error checking user badge eligibility:', error);
      return false;
    }
  }

  // Get badges by rarity
  static async getBadgesByRarity(rarity) {
    try {
      return await prisma.badge.findMany({
        where: {
          rarity,
          isActive: true,
        },
        include: {
          userBadges: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error getting badges by rarity:', error);
      throw error;
    }
  }

  // Update badge status
  static async updateStatus(badgeId, isActive) {
    try {
      return await prisma.badge.update({
        where: { id: badgeId },
        data: { isActive },
      });
    } catch (error) {
      console.error('Error updating badge status:', error);
      throw error;
    }
  }

  // Get badge statistics
  static async getBadgeStats(badgeId) {
    try {
      const badge = await prisma.badge.findUnique({
        where: { id: badgeId },
        include: {
          userBadges: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  walletAddress: true,
                },
              },
            },
          },
        },
      });

      if (!badge) {
        return null;
      }

      return {
        badge: {
          id: badge.id,
          name: badge.name,
          rarity: badge.rarity,
          totalSupply: badge.maxSupply,
          currentSupply: badge.currentSupply,
        },
        recipients: badge.userBadges.map(ub => ({
          user: ub.user,
          awardedAt: ub.awardedAt,
          source: ub.source,
        })),
        stats: {
          totalAwarded: badge.userBadges.length,
          remainingSupply: badge.maxSupply ? badge.maxSupply - badge.currentSupply : null,
        },
      };
    } catch (error) {
      console.error('Error getting badge stats:', error);
      throw error;
    }
  }
}

module.exports = BadgeModel;