const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../utils/errorHandler');

// JWT Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return next(new UnauthorizedError('Access token required'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }
    
    req.user = user;
    next();
  });
}

// Optional authentication - doesn't fail if no token
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continue without authentication
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
}

// Generate JWT token
function generateToken(payload, expiresIn = process.env.JWT_EXPIRES_IN || '7d') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// Verify wallet signature middleware
function verifyWalletSignature(req, res, next) {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return next(new UnauthorizedError('Wallet address, signature, and message are required'));
  }

  try {
    const { ethers } = require('ethers');
    
    // Verify the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return next(new UnauthorizedError('Invalid wallet signature'));
    }

    // Check if message is recent (within 5 minutes)
    const messageTimestamp = parseInt(message.split('Timestamp: ')[1]);
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (currentTime - messageTimestamp > fiveMinutes) {
      return next(new UnauthorizedError('Message timestamp too old'));
    }

    req.walletAddress = walletAddress.toLowerCase();
    next();
  } catch (error) {
    next(new UnauthorizedError('Failed to verify wallet signature'));
  }
}

// Check if user owns the resource (based on wallet address)
function checkResourceOwnership(req, res, next) {
  const { walletAddress } = req.params;
  const userWalletAddress = req.user?.walletAddress;

  if (!userWalletAddress) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (userWalletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return next(new ForbiddenError('Access denied to this resource'));
  }

  next();
}

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken,
  verifyWalletSignature,
  checkResourceOwnership,
};