const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  uploadJSON, 
  uploadFile, 
  getFromIPFS, 
  uploadUserProfile, 
  uploadEventData, 
  uploadBadgeMetadata 
} = require('../services/ipfsService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  }
});

// Upload JSON data to IPFS
router.post('/upload-json', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Data is required'
      });
    }
    
    const result = await uploadJSON(data);
    
    res.json({
      success: true,
      message: 'Data uploaded to IPFS successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload data to IPFS',
      error: error.message
    });
  }
});

// Upload file to IPFS
router.post('/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const result = await uploadFile(req.file.path);
    
    // Clean up local file
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      message: 'File uploaded to IPFS successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    
    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload file to IPFS',
      error: error.message
    });
  }
});

// Upload user profile to IPFS
router.post('/upload-profile', async (req, res) => {
  try {
    const profileData = req.body;
    
    if (!profileData.name || !profileData.email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }
    
    const result = await uploadUserProfile(profileData);
    
    res.json({
      success: true,
      message: 'User profile uploaded to IPFS successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading user profile to IPFS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload user profile to IPFS',
      error: error.message
    });
  }
});

// Upload event data to IPFS
router.post('/upload-event', async (req, res) => {
  try {
    const eventData = req.body;
    
    if (!eventData.title || !eventData.description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    
    const result = await uploadEventData(eventData);
    
    res.json({
      success: true,
      message: 'Event data uploaded to IPFS successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading event data to IPFS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload event data to IPFS',
      error: error.message
    });
  }
});

// Upload badge metadata to IPFS
router.post('/upload-badge', async (req, res) => {
  try {
    const badgeData = req.body;
    
    if (!badgeData.name || !badgeData.description) {
      return res.status(400).json({
        success: false,
        message: 'Name and description are required'
      });
    }
    
    const result = await uploadBadgeMetadata(badgeData);
    
    res.json({
      success: true,
      message: 'Badge metadata uploaded to IPFS successfully',
      data: result
    });
  } catch (error) {
    console.error('Error uploading badge metadata to IPFS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload badge metadata to IPFS',
      error: error.message
    });
  }
});

// Retrieve data from IPFS
router.get('/retrieve/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({
        success: false,
        message: 'Hash is required'
      });
    }
    
    const data = await getFromIPFS(hash);
    
    res.json({
      success: true,
      message: 'Data retrieved from IPFS successfully',
      data: data
    });
  } catch (error) {
    console.error('Error retrieving data from IPFS:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve data from IPFS',
      error: error.message
    });
  }
});

// Get IPFS gateway URL for a hash
router.get('/url/:hash', (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({
        success: false,
        message: 'Hash is required'
      });
    }
    
    const url = ${process.env.IPFS_GATEWAY};
    
    res.json({
      success: true,
      message: 'IPFS URL generated successfully',
      data: {
        hash: hash,
        url: url
      }
    });
  } catch (error) {
    console.error('Error generating IPFS URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate IPFS URL',
      error: error.message
    });
  }
});

module.exports = router;
