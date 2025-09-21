# Zynqtra Backend API

A comprehensive backend API for the Zynqtra Web3 networking platform, featuring IPFS integration, blockchain connectivity, and real-time features.

##  Features

- **IPFS Integration**: Decentralized storage for metadata and files
- **Blockchain Connectivity**: Smart contract interaction with Arbitrum Sepolia
- **Real-time Communication**: Socket.io for live updates
- **File Upload**: Support for images and documents
- **JWT Authentication**: Secure API access
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error management

##  Architecture

`
backend/
 src/
    config/          # Configuration files
    controllers/     # Route controllers
    middleware/      # Custom middleware
    models/          # Data models
    routes/          # API routes
    services/        # Business logic
    utils/           # Utility functions
    server.js        # Main server file
 tests/               # Test files
 uploads/             # Temporary file storage
 .env                 # Environment variables
 package.json         # Dependencies
`

##  Installation

1. **Install dependencies:**
   `ash
   npm install
   `

2. **Set up environment variables:**
   Copy .env.example to .env and fill in your values:
   `ash
   cp .env.example .env
   `

3. **Configure IPFS:**
   - Get Infura IPFS credentials
   - Update IPFS_PROJECT_ID and IPFS_PROJECT_SECRET in .env

4. **Start the server:**
   `ash
   # Development
   npm run dev
   
   # Production
   npm start
   `

##  Environment Variables

### Required Variables:
- PORT: Server port (default: 5000)
- ARBITRUM_RPC_URL: Arbitrum Sepolia RPC endpoint
- PRIVATE_KEY: Wallet private key for contract interaction
- IPFS_PROJECT_ID: Infura IPFS project ID
- IPFS_PROJECT_SECRET: Infura IPFS project secret
- JWT_SECRET: Secret key for JWT tokens

### Contract Addresses:
- PROFILE_CONTRACT: ZynqtraProfile contract address
- EVENTS_CONTRACT: ZynqtraEvents contract address
- BADGES_CONTRACT: ZynqtraBadges contract address
- CHALLENGES_CONTRACT: ZynqtraChallenges contract address
- MAIN_CONTRACT: ZynqtraMain contract address

##  API Endpoints

### IPFS Routes (/api/ipfs)
- POST /upload-json - Upload JSON data to IPFS
- POST /upload-file - Upload file to IPFS
- POST /upload-profile - Upload user profile to IPFS
- POST /upload-event - Upload event data to IPFS
- POST /upload-badge - Upload badge metadata to IPFS
- GET /retrieve/:hash - Retrieve data from IPFS
- GET /url/:hash - Get IPFS gateway URL

### Health Check
- GET /health - Server health status

##  IPFS Integration

The backend uses IPFS for decentralized storage of:
- User profile metadata
- Event information
- Badge metadata
- Challenge data
- Media files

### IPFS Services:
- **uploadJSON()**: Upload JSON data to IPFS
- **uploadFile()**: Upload files to IPFS
- **getFromIPFS()**: Retrieve data from IPFS
- **pinContent()**: Pin content to keep it available

##  Blockchain Integration

The backend connects to Arbitrum Sepolia for:
- User profile management
- Event creation and management
- Badge awarding
- Challenge tracking
- Real-time event monitoring

### Smart Contract Functions:
- **createUserProfile()**: Create user profile on blockchain
- **updateUserProfile()**: Update profile with IPFS hash
- **createEvent()**: Create event on blockchain
- **awardBadge()**: Award badges to users

##  Data Flow

1. **User uploads data**  Backend receives request
2. **Data processed**  Validation and formatting
3. **Upload to IPFS**  Get IPFS hash
4. **Update blockchain**  Store hash on smart contract
5. **Store metadata**  Save to database (if needed)
6. **Real-time update**  Notify frontend via Socket.io

##  Security Features

- **JWT Authentication**: Secure API access
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Sanitize all inputs
- **File Type Validation**: Only allow safe file types
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers

##  Monitoring

- **Health Check**: /health endpoint
- **Logging**: Morgan for request logging
- **Error Tracking**: Comprehensive error handling
- **Performance**: Compression middleware

##  Deployment

1. **Set production environment variables**
2. **Install dependencies**: 
pm install --production
3. **Start server**: 
pm start
4. **Use PM2 for process management** (recommended)

##  Testing

`ash
# Run tests
npm test

# Run with coverage
npm run test:coverage
`

##  API Documentation

For detailed API documentation, visit /api/docs when the server is running.

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

##  License

MIT License - see LICENSE file for details
