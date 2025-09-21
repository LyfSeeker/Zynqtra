// Global error handler middleware
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Mongoose/Prisma validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Prisma errors
  if (err.code && err.code.startsWith('P')) {
    return handlePrismaError(err, res);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // IPFS errors
  if (err.message && err.message.includes('IPFS')) {
    return res.status(503).json({
      success: false,
      message: 'IPFS service unavailable',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Service temporarily unavailable',
    });
  }

  // Blockchain/Ethereum errors
  if (err.code && (err.code === 'NETWORK_ERROR' || err.code === 'INSUFFICIENT_FUNDS')) {
    return res.status(503).json({
      success: false,
      message: 'Blockchain service error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Blockchain temporarily unavailable',
    });
  }

  // Duplicate key error (unique constraint)
  if (err.code === 11000 || (err.message && err.message.includes('duplicate key'))) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate ${field}`,
      error: `A record with this ${field} already exists`,
    });
  }

  // Cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Rate limit errors
  if (err.statusCode === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests',
      error: 'Please try again later',
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      details: err
    } : 'Something went wrong',
  });
}

// Handle Prisma-specific errors
function handlePrismaError(err, res) {
  console.error('Prisma Error:', err.code, err.message);

  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      const target = err.meta?.target || ['field'];
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry',
        error: `A record with this ${target.join(', ')} already exists`,
      });

    case 'P2025':
      // Record not found
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        error: 'The requested resource does not exist',
      });

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        message: 'Invalid reference',
        error: 'The referenced record does not exist',
      });

    case 'P2014':
      // Required relation violation
      return res.status(400).json({
        success: false,
        message: 'Missing required relation',
        error: 'A required related record is missing',
      });

    case 'P2023':
      // Inconsistent column data
      return res.status(400).json({
        success: false,
        message: 'Invalid data format',
        error: 'The provided data format is inconsistent',
      });

    case 'P1001':
      // Database connection error
      return res.status(503).json({
        success: false,
        message: 'Database connection error',
        error: 'Unable to connect to the database',
      });

    case 'P1002':
      // Database timeout
      return res.status(503).json({
        success: false,
        message: 'Database timeout',
        error: 'Database operation timed out',
      });

    default:
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected database error occurred',
      });
  }
}

// Async handler wrapper to catch errors in async route handlers
function handleAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Not found handler
function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
  });
}

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503);
  }
}

// Helper function to create error responses
function createErrorResponse(message, statusCode = 500, errors = null) {
  return {
    success: false,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString(),
  };
}

// Helper function to create success responses
function createSuccessResponse(data = null, message = 'Success') {
  return {
    success: true,
    message,
    ...(data && { data }),
    timestamp: new Date().toISOString(),
  };
}

// Log errors to external service (implement based on your logging service)
function logError(error, req = null) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
    ...(req && {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    }),
  };

  // In production, you might want to send this to a logging service
  // like Winston, Loggly, Sentry, etc.
  console.error('Error logged:', errorInfo);
  
  // Example: Send to external logging service
  // await loggingService.log(errorInfo);
}

module.exports = {
  errorHandler,
  handlePrismaError,
  handleAsync,
  notFoundHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ServiceUnavailableError,
  createErrorResponse,
  createSuccessResponse,
  logError,
};