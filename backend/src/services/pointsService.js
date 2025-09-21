const prisma = require('../config/database');

class PointsService {
  // Award points to a user
  static async awardPoints(userId, points, source, sourceId = null, description = null, metadata = {}) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const balanceBefore = user.totalPoints;
      const balanceAfter = balanceBefore + points;

      // Create points transaction
      await prisma.pointsTransaction.create({
        data: {
          userId,
          points,
          type: points > 0 ? 'EARNED' : 'SPENT',
          source,
          sourceId,
          description,
          metadata,
          balanceBefore,
          balanceAfter,
        }
      });

      // Update user's total points and level
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          totalPoints: balanceAfter,
          level: this.calculateLevel(balanceAfter),
        }
      });

      // Log the activity
      await this.logActivity(userId, 'points_awarded', 'points', null, {
        points,
        source,
        sourceId,
        newTotal: balanceAfter,
        newLevel: this.calculateLevel(balanceAfter)
      });

      return updatedUser;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Calculate level based on points (simple progression)
  static calculateLevel(points) {
    if (points < 100) return 1;
    if (points < 500) return 2;
    if (points < 1500) return 3;
    if (points < 3500) return 4;
    if (points < 7500) return 5;
    
    // Level 6+ requires 10000 points per level
    return Math.floor((points - 7500) / 10000) + 6;
  }

  // Get user's points history
  static async getPointsHistory(userId, limit = 50, offset = 0) {
    try {
      return await prisma.pointsTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      console.error('Error getting points history:', error);
      throw error;
    }
  }

  // Get points leaderboard
  static async getLeaderboard(limit = 10) {
    try {
      return await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          walletAddress: true,
          profileImageUrl: true,
          totalPoints: true,
          level: true,
          eventsAttended: true,
          badgesEarned: true,
          connectionsCount: true,
        },
        orderBy: {
          totalPoints: 'desc'
        },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Update user activity counters
  static async updateActivityCounters(userId, updates) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          lastActive: new Date(),
        }
      });
    } catch (error) {
      console.error('Error updating activity counters:', error);
      throw error;
    }
  }

  // Log user activity
  static async logActivity(userId, action, entityType, entityId = null, metadata = {}, description = null) {
    try {
      return await prisma.activityLog.create({
        data: {
          userId,
          action,
          entityType,
          entityId,
          metadata,
          description,
        }
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }

  // Get user activity log
  static async getActivityLog(userId, limit = 50, offset = 0) {
    try {
      return await prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      console.error('Error getting activity log:', error);
      throw error;
    }
  }

  // Award points for event attendance
  static async awardEventAttendancePoints(userId, eventId, points = 50) {
    try {
      await this.awardPoints(
        userId, 
        points, 
        'event_attendance', 
        eventId,
        `Attended event and earned ${points} points`,
        { eventId, attendancePoints: points }
      );

      // Update activity counter
      await this.updateActivityCounters(userId, {
        eventsAttended: { increment: 1 }
      });

      return true;
    } catch (error) {
      console.error('Error awarding event attendance points:', error);
      throw error;
    }
  }

  // Award points for badge earning
  static async awardBadgePoints(userId, badgeId, points = 100) {
    try {
      await this.awardPoints(
        userId,
        points,
        'badge_award',
        badgeId,
        `Earned badge and received ${points} points`,
        { badgeId, badgePoints: points }
      );

      // Update activity counter
      await this.updateActivityCounters(userId, {
        badgesEarned: { increment: 1 }
      });

      return true;
    } catch (error) {
      console.error('Error awarding badge points:', error);
      throw error;
    }
  }

  // Award points for making connections
  static async awardConnectionPoints(userId, connectionId, points = 25) {
    try {
      await this.awardPoints(
        userId,
        points,
        'new_connection',
        connectionId,
        `Made new connection and earned ${points} points`,
        { connectionId, connectionPoints: points }
      );

      // Update activity counter  
      await this.updateActivityCounters(userId, {
        connectionsCount: { increment: 1 }
      });

      return true;
    } catch (error) {
      console.error('Error awarding connection points:', error);
      throw error;
    }
  }

  // Award points for hosting events
  static async awardEventHostingPoints(userId, eventId, points = 75) {
    try {
      await this.awardPoints(
        userId,
        points,
        'event_hosting',
        eventId,
        `Hosted event and earned ${points} points`,
        { eventId, hostingPoints: points }
      );

      // Update activity counter
      await this.updateActivityCounters(userId, {
        eventsHosted: { increment: 1 }
      });

      return true;
    } catch (error) {
      console.error('Error awarding event hosting points:', error);
      throw error;
    }
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const [user, pointsEarned, pointsSpent, totalActivities] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            totalPoints: true,
            level: true,
            eventsAttended: true,
            eventsHosted: true,
            connectionsCount: true,
            badgesEarned: true,
          }
        }),
        prisma.pointsTransaction.aggregate({
          where: { 
            userId,
            points: { gt: 0 }
          },
          _sum: { points: true }
        }),
        prisma.pointsTransaction.aggregate({
          where: { 
            userId,
            points: { lt: 0 }
          },
          _sum: { points: true }
        }),
        prisma.activityLog.count({
          where: { userId }
        })
      ]);

      return {
        ...user,
        totalPointsEarned: pointsEarned._sum.points || 0,
        totalPointsSpent: Math.abs(pointsSpent._sum.points || 0),
        totalActivities,
        nextLevelPoints: this.getNextLevelPoints(user.totalPoints),
        progressToNextLevel: this.getLevelProgress(user.totalPoints),
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Get points required for next level
  static getNextLevelPoints(currentPoints) {
    const currentLevel = this.calculateLevel(currentPoints);
    const nextLevel = currentLevel + 1;
    
    // Level progression thresholds
    const levelThresholds = [0, 100, 500, 1500, 3500, 7500];
    
    if (nextLevel <= 5) {
      return levelThresholds[nextLevel];
    }
    
    // For levels 6+: 10000 points per level after level 5
    return 7500 + ((nextLevel - 5) * 10000);
  }

  // Get progress percentage to next level
  static getLevelProgress(currentPoints) {
    const currentLevel = this.calculateLevel(currentPoints);
    const nextLevelPoints = this.getNextLevelPoints(currentPoints);
    const currentLevelPoints = currentLevel === 1 ? 0 : this.getNextLevelPoints(0); // This needs fixing
    
    if (nextLevelPoints === currentLevelPoints) return 100;
    
    const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  }
}

module.exports = PointsService;