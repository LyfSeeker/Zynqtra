const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Verify wallet signature (simplified)
const verifyWalletSignature = (walletAddress, signature, message) => {
  // This is a simplified verification
  // In production, you should use proper signature verification
  try {
    // For now, we'll just check if the wallet address is valid
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(walletAddress);
    return isValidAddress;
  } catch (error) {
    return false;
  }
};

module.exports = {
  authenticateToken,
  generateToken,
  verifyWalletSignature
};
