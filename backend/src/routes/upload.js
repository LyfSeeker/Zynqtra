const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../services/ipfsService');
const { handleAsync } = require('../utils/errorHandler');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// Upload single file to IPFS
router.post('/upload', upload.single('file'), handleAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  try {
    // Upload to IPFS
    const ipfsResult = await uploadFile(req.file.path);
    
    // Store IPFS content information in database
    const prisma = require('../config/database');
    const ipfsContent = await prisma.iPFSContent.create({
      data: {
        hash: ipfsResult.hash,
        contentType: 'OTHER', // Will be updated based on context
        size: BigInt(req.file.size),
        mimeType: req.file.mimetype,
        filename: req.file.originalname,
        entityType: req.body.entityType || 'file',
        entityId: req.body.entityId || 'unknown',
        isPinned: true,
        pinnedAt: new Date(),
      },
    });

    // Clean up local file
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: 'File uploaded to IPFS successfully',
      data: {
        hash: ipfsResult.hash,
        url: ipfsResult.url,
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    // Clean up local file on error
    const fs = require('fs');
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
}));

// Get content from IPFS
router.get('/content/:hash', handleAsync(async (req, res) => {
  const { hash } = req.params;
  
  const { getFromIPFS } = require('../services/ipfsService');
  const content = await getFromIPFS(hash);

  res.json({
    success: true,
    data: content,
  });
}));

module.exports = router;