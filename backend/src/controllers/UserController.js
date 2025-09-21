const UserModel = require('../models/User');
const { validateUserProfile } = require('../utils/validation');
const { handleAsync } = require('../utils/errorHandler');

class UserController {
  // Create user profile
  static createProfile = handleAsync(async (req, res) => {
    const { error, value } = validateUserProfile(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message),
      });
    }

    const user = await UserModel.create(value);
    
    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: user,
    });
  });

  // Get user profile by wallet address
  static getProfile = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }

    const user = await UserModel.getProfileWithMetadata(walletAddress);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  });

  // Update user profile
  static updateProfile = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    const updateData = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }

    const user = await UserModel.update(walletAddress, updateData);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  });

  // Search users by interests
  static searchUsers = handleAsync(async (req, res) => {
    const { interests, skills, limit = 20 } = req.query;
    
    const interestsArray = interests ? interests.split(',').map(i => i.trim()) : [];
    const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];
    
    if (interestsArray.length === 0 && skillsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one interest or skill is required for search',
      });
    }

    const users = await UserModel.searchByInterests(interestsArray, skillsArray);
    
    res.json({
      success: true,
      data: users.slice(0, parseInt(limit)),
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

    res.json({
      success: true,
      data: user.userBadges,
    });
  });

  // Get user's events
  static getUserEvents = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    
    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const EventModel = require('../models/Event');
    const events = await EventModel.getUserEvents(user.id);
    
    res.json({
      success: true,
      data: events,
    });
  });

  // Award points to user
  static awardPoints = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    const { points, source } = req.body;

    if (!points || !source) {
      return res.status(400).json({
        success: false,
        message: 'Points and source are required',
      });
    }

    const user = await UserModel.awardPoints(walletAddress, points, source);
    
    res.json({
      success: true,
      message: 'Points awarded successfully',
      data: {
        totalPoints: user.totalPoints,
        level: user.level,
      },
    });
  });

  // Get leaderboard
  static getLeaderboard = handleAsync(async (req, res) => {
    const { limit = 10 } = req.query;
    
    const leaderboard = await UserModel.getLeaderboard(parseInt(limit));
    
    res.json({
      success: true,
      data: leaderboard,
    });
  });

  // Get user connections
  static getConnections = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    
    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user.connections,
    });
  });

  // Send connection request
  static sendConnectionRequest = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    const { toWalletAddress } = req.body;

    if (!toWalletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Target wallet address is required',
      });
    }

    const fromUser = await UserModel.findByWalletAddress(walletAddress);
    const toUser = await UserModel.findByWalletAddress(toWalletAddress);

    if (!fromUser || !toUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create connection request in database
    const prisma = require('../config/database');
    const connection = await prisma.connection.create({
      data: {
        fromUserId: fromUser.id,
        toUserId: toUser.id,
        status: 'PENDING',
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            profileImageUrl: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Emit socket event to notify the target user
    const io = req.app.get('io');
    io.to(toWalletAddress).emit('connection_request', {
      from: connection.fromUser,
      connectionId: connection.id,
    });

    res.json({
      success: true,
      message: 'Connection request sent',
      data: connection,
    });
  });

  // Accept connection request
  static acceptConnectionRequest = handleAsync(async (req, res) => {
    const { walletAddress } = req.params;
    const { connectionId } = req.body;

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        message: 'Connection ID is required',
      });
    }

    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const prisma = require('../config/database');
    const connection = await prisma.connection.update({
      where: { id: connectionId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            profileImageUrl: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Emit socket event to notify both users
    const io = req.app.get('io');
    io.to(connection.fromUser.walletAddress).emit('connection_accepted', {
      connection,
    });
    io.to(connection.toUser.walletAddress).emit('connection_accepted', {
      connection,
    });

    res.json({
      success: true,
      message: 'Connection accepted',
      data: connection,
    });
  });
}

module.exports = UserController;