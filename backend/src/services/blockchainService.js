const { ethers } = require('ethers');

let provider = null;
let contracts = {};

// Initialize blockchain connection
async function initializeBlockchain() {
  try {
    // Create provider
    provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC_URL);
    
    // Get network info
    const network = await provider.getNetwork();
    console.log('Connected to network:', network.name, 'Chain ID:', network.chainId.toString());
    
    // Create wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('Wallet address:', wallet.address);
    
    // Contract ABIs (simplified for now)
    const profileABI = [
      'function createProfile(string memory name, string memory email, string[] memory interests, string memory ipfsHash) external',
      'function updateProfile(string memory ipfsHash) external',
      'function getUserProfile(address user) external view returns (string memory, string memory, string[] memory, uint256, uint256, uint256, uint256, string memory, string memory, string memory, bool, uint256, uint256)',
      'function sendConnectionRequest(address to) external',
      'function acceptConnectionRequest(address from) external',
      'function awardPoints(address user, uint256 points) external',
      'event ProfileCreated(address indexed user, string name, uint256 tokenId)',
      'event ProfileUpdated(address indexed user, string ipfsHash)',
      'event ConnectionRequestSent(address indexed from, address indexed to)',
      'event ConnectionAccepted(address indexed from, address indexed to)'
    ];
    
    const eventsABI = [
      'function createEvent(string memory title, string memory description, string memory location, string memory ipfsMetadata, uint256 startTime, uint256 endTime, uint256 maxAttendees, uint256 registrationFee, uint8 eventType, string[] memory targetInterests, uint256 pointsReward, bool requiresApproval) external returns (uint256)',
      'function registerForEvent(uint256 eventId) external payable',
      'function checkIn(uint256 eventId, string memory qrCodeHash) external',
      'function getEvent(uint256 eventId) external view returns (string memory, string memory, string memory, string memory, address, uint256, uint256, uint256, uint256, uint8, uint8, string[] memory, uint256, bool, uint256, uint256)',
      'event EventCreated(uint256 indexed eventId, address indexed host, string title)',
      'event EventRegistration(uint256 indexed eventId, address indexed participant)',
      'event EventCheckIn(uint256 indexed eventId, address indexed participant)'
    ];
    
    const badgesABI = [
      'function createBadge(string memory name, string memory description, string memory ipfsMetadata, uint8 badgeType, uint8 rarity, uint256 pointsRequired, uint256 maxSupply, bool isTransferable) external returns (uint256)',
      'function awardBadge(address user, uint256 badgeId, string memory source) external',
      'function getUserBadges(address user) external view returns (uint256[] memory)',
      'function getBadge(uint256 badgeId) external view returns (string memory, string memory, string memory, uint8, uint8, uint256, uint256, uint256, bool, bool, uint256, address)',
      'event BadgeCreated(uint256 indexed badgeId, string name, uint8 rarity)',
      'event BadgeAwarded(address indexed user, uint256 indexed badgeId, string source, uint256 pointsEarned)'
    ];
    
    // Initialize contracts
    contracts.profile = new ethers.Contract(process.env.PROFILE_CONTRACT, profileABI, wallet);
    contracts.events = new ethers.Contract(process.env.EVENTS_CONTRACT, eventsABI, wallet);
    contracts.badges = new ethers.Contract(process.env.BADGES_CONTRACT, badgesABI, wallet);
    
    console.log(' Smart contracts initialized');
    return { provider, contracts, wallet };
  } catch (error) {
    console.error('Failed to initialize blockchain:', error);
    throw error;
  }
}

// Get contract instances
function getContracts() {
  if (!contracts.profile) {
    throw new Error('Blockchain not initialized');
  }
  return contracts;
}

// Get provider
function getProvider() {
  if (!provider) {
    throw new Error('Blockchain not initialized');
  }
  return provider;
}

// Create user profile on blockchain
async function createUserProfile(profileData) {
  try {
    const { profile } = getContracts();
    
    const tx = await profile.createProfile(
      profileData.name,
      profileData.email,
      profileData.interests,
      profileData.ipfsHash
    );
    
    const receipt = await tx.wait();
    console.log('Profile created on blockchain:', receipt.transactionHash);
    
    return {
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  } catch (error) {
    console.error('Error creating user profile on blockchain:', error);
    throw error;
  }
}

// Update user profile on blockchain
async function updateUserProfile(walletAddress, ipfsHash) {
  try {
    const { profile } = getContracts();
    
    const tx = await profile.updateProfile(ipfsHash);
    const receipt = await tx.wait();
    
    console.log('Profile updated on blockchain:', receipt.transactionHash);
    return {
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error updating user profile on blockchain:', error);
    throw error;
  }
}

// Create event on blockchain
async function createEvent(eventData) {
  try {
    const { events } = getContracts();
    
    const tx = await events.createEvent(
      eventData.title,
      eventData.description,
      eventData.location,
      eventData.ipfsMetadata,
      eventData.startTime,
      eventData.endTime,
      eventData.maxAttendees,
      eventData.registrationFee,
      eventData.eventType,
      eventData.targetInterests,
      eventData.pointsReward,
      eventData.requiresApproval
    );
    
    const receipt = await tx.wait();
    console.log('Event created on blockchain:', receipt.transactionHash);
    
    return {
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error creating event on blockchain:', error);
    throw error;
  }
}

// Award badge on blockchain
async function awardBadge(userAddress, badgeId, source) {
  try {
    const { badges } = getContracts();
    
    const tx = await badges.awardBadge(userAddress, badgeId, source);
    const receipt = await tx.wait();
    
    console.log('Badge awarded on blockchain:', receipt.transactionHash);
    return {
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error awarding badge on blockchain:', error);
    throw error;
  }
}

// Listen to blockchain events
function setupEventListeners() {
  try {
    const { profile, events, badges } = getContracts();
    
    // Profile events
    profile.on('ProfileCreated', (user, name, tokenId) => {
      console.log('Profile created:', user, name, tokenId.toString());
      // Emit to frontend via Socket.io
    });
    
    profile.on('ProfileUpdated', (user, ipfsHash) => {
      console.log('Profile updated:', user, ipfsHash);
    });
    
    // Event events
    events.on('EventCreated', (eventId, host, title) => {
      console.log('Event created:', eventId.toString(), host, title);
    });
    
    // Badge events
    badges.on('BadgeAwarded', (user, badgeId, source, pointsEarned) => {
      console.log('Badge awarded:', user, badgeId.toString(), source, pointsEarned.toString());
    });
    
    console.log(' Blockchain event listeners set up');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

module.exports = {
  initializeBlockchain,
  getContracts,
  getProvider,
  createUserProfile,
  updateUserProfile,
  createEvent,
  awardBadge,
  setupEventListeners
};
