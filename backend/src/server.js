const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { createServer } = require('http');
const { Server } = require('socket.io');

// Import services
const { initializeIPFS } = require('./services/ipfsService');
const { initializeBlockchain, setupEventListeners } = require('./services/blockchainService');

// Import routes and middleware
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', routes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('join_room', (walletAddress) => {
    socket.join(walletAddress);
    console.log(`User ${socket.id} joined their room`);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize services
async function initializeServices() {
  try {
    await initializeIPFS();
    console.log('✅ IPFS service initialized');
    
    await initializeBlockchain();
    console.log('✅ Blockchain service initialized');
    
    setupEventListeners();
    console.log('✅ Event listeners set up');
    
    console.log('🎉 All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Zynqtra Backend Server running on port ${PORT}`);
  initializeServices();
});

module.exports = app;
