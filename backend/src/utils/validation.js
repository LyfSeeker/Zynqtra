const Joi = require('joi');

// User profile validation schema
const userProfileSchema = Joi.object({
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid wallet address format',
      'any.required': 'Wallet address is required'
    }),
  
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must not be empty',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Invalid email format'
    }),
  
  bio: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Bio must not exceed 500 characters'
    }),
  
  interests: Joi.array()
    .items(Joi.string().min(1).max(50))
    .max(20)
    .optional()
    .messages({
      'array.max': 'Maximum 20 interests allowed',
      'string.min': 'Interest must not be empty',
      'string.max': 'Interest must not exceed 50 characters'
    }),
  
  skills: Joi.array()
    .items(Joi.string().min(1).max(50))
    .max(20)
    .optional()
    .messages({
      'array.max': 'Maximum 20 skills allowed',
      'string.min': 'Skill must not be empty',
      'string.max': 'Skill must not exceed 50 characters'
    }),
  
  location: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'Location must not exceed 100 characters'
    }),
  
  linkedinUsername: Joi.string()
    .pattern(/^[a-zA-Z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid LinkedIn username format'
    }),
  
  twitterUsername: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid Twitter username format'
    }),
  
  githubUsername: Joi.string()
    .pattern(/^[a-zA-Z0-9-]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid GitHub username format'
    }),
  
  profileImageUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Invalid profile image URL'
    })
});

// Event validation schema
const eventSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 2000 characters',
      'any.required': 'Description is required'
    }),
  
  location: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Location must be at least 3 characters long',
      'string.max': 'Location must not exceed 200 characters',
      'any.required': 'Location is required'
    }),
  
  hostWalletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid host wallet address format',
      'any.required': 'Host wallet address is required'
    }),
  
  startTime: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.greater': 'Start time must be in the future',
      'any.required': 'Start time is required'
    }),
  
  endTime: Joi.date()
    .greater(Joi.ref('startTime'))
    .required()
    .messages({
      'date.greater': 'End time must be after start time',
      'any.required': 'End time is required'
    }),
  
  maxAttendees: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'number.min': 'Maximum attendees must be at least 1',
      'number.max': 'Maximum attendees cannot exceed 10,000',
      'any.required': 'Maximum attendees is required'
    }),
  
  registrationFee: Joi.string()
    .pattern(/^\d+$/)
    .default('0')
    .messages({
      'string.pattern.base': 'Registration fee must be a valid number in wei'
    }),
  
  eventType: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .default(0)
    .messages({
      'number.min': 'Invalid event type',
      'number.max': 'Invalid event type'
    }),
  
  pointsReward: Joi.number()
    .integer()
    .min(0)
    .max(10000)
    .default(0)
    .messages({
      'number.min': 'Points reward cannot be negative',
      'number.max': 'Points reward cannot exceed 10,000'
    }),
  
  requiresApproval: Joi.boolean()
    .default(false),
  
  targetInterests: Joi.array()
    .items(Joi.string().min(1).max(50))
    .max(10)
    .optional()
    .messages({
      'array.max': 'Maximum 10 target interests allowed',
      'string.min': 'Interest must not be empty',
      'string.max': 'Interest must not exceed 50 characters'
    }),
  
  agenda: Joi.array()
    .items(Joi.object({
      time: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().optional()
    }))
    .optional(),
  
  speakers: Joi.array()
    .items(Joi.object({
      name: Joi.string().required(),
      bio: Joi.string().optional(),
      profileUrl: Joi.string().uri().optional()
    }))
    .optional(),
  
  requirements: Joi.array()
    .items(Joi.string())
    .optional(),
  
  media: Joi.array()
    .items(Joi.object({
      type: Joi.string().valid('image', 'video', 'document').required(),
      url: Joi.string().uri().required(),
      description: Joi.string().optional()
    }))
    .optional()
});

// Badge validation schema
const badgeSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Badge name must be at least 3 characters long',
      'string.max': 'Badge name must not exceed 100 characters',
      'any.required': 'Badge name is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 500 characters',
      'any.required': 'Description is required'
    }),
  
  imageUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Invalid image URL'
    }),
  
  badgeType: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .default(0)
    .messages({
      'number.min': 'Invalid badge type',
      'number.max': 'Invalid badge type'
    }),
  
  rarity: Joi.string()
    .valid('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY')
    .default('COMMON')
    .messages({
      'any.only': 'Invalid rarity level'
    }),
  
  pointsRequired: Joi.number()
    .integer()
    .min(0)
    .max(100000)
    .default(0)
    .messages({
      'number.min': 'Points required cannot be negative',
      'number.max': 'Points required cannot exceed 100,000'
    }),
  
  maxSupply: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.min': 'Max supply must be at least 1'
    }),
  
  isTransferable: Joi.boolean()
    .default(true),
  
  creatorAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid creator address format'
    }),
  
  category: Joi.string()
    .max(50)
    .optional()
    .messages({
      'string.max': 'Category must not exceed 50 characters'
    }),
  
  requirements: Joi.array()
    .items(Joi.string())
    .optional()
});

// Challenge validation schema
const challengeSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(2000)
    .required()
    .messages({
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description must not exceed 2000 characters',
      'any.required': 'Description is required'
    }),
  
  challengeType: Joi.number()
    .integer()
    .min(0)
    .max(10)
    .default(0)
    .messages({
      'number.min': 'Invalid challenge type',
      'number.max': 'Invalid challenge type'
    }),
  
  difficulty: Joi.string()
    .valid('EASY', 'MEDIUM', 'HARD', 'EXPERT')
    .default('EASY')
    .messages({
      'any.only': 'Invalid difficulty level'
    }),
  
  pointsReward: Joi.number()
    .integer()
    .min(1)
    .max(10000)
    .required()
    .messages({
      'number.min': 'Points reward must be at least 1',
      'number.max': 'Points reward cannot exceed 10,000',
      'any.required': 'Points reward is required'
    }),
  
  timeLimit: Joi.number()
    .integer()
    .min(60)
    .optional()
    .messages({
      'number.min': 'Time limit must be at least 60 seconds'
    }),
  
  maxAttempts: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .default(1)
    .messages({
      'number.min': 'Max attempts must be at least 1',
      'number.max': 'Max attempts cannot exceed 10'
    }),
  
  requirements: Joi.object().optional(),
  validationCriteria: Joi.object().optional(),
  
  startDate: Joi.date()
    .optional(),
  
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .optional()
    .messages({
      'date.greater': 'End date must be after start date'
    }),
  
  creatorAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid creator address format'
    })
});

// Validation helper functions
function validateUserProfile(data) {
  return userProfileSchema.validate(data, { abortEarly: false });
}

function validateEvent(data) {
  return eventSchema.validate(data, { abortEarly: false });
}

function validateBadge(data) {
  return badgeSchema.validate(data, { abortEarly: false });
}

function validateChallenge(data) {
  return challengeSchema.validate(data, { abortEarly: false });
}

// Wallet address validation
function isValidWalletAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// IPFS hash validation
function isValidIPFSHash(hash) {
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
}

// Pagination validation
function validatePagination(page = 1, limit = 10) {
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  
  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit
  };
}

// Sanitize user input
function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
}

// Validate and sanitize object
function validateAndSanitizeObject(obj, schema) {
  // First sanitize the input
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeInput(value);
  }
  
  // Then validate
  return schema.validate(sanitized, { abortEarly: false });
}

module.exports = {
  validateUserProfile,
  validateEvent,
  validateBadge,
  validateChallenge,
  isValidWalletAddress,
  isValidIPFSHash,
  validatePagination,
  sanitizeInput,
  validateAndSanitizeObject,
  schemas: {
    userProfileSchema,
    eventSchema,
    badgeSchema,
    challengeSchema
  }
};