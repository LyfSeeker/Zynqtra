# Zynqtra Smart Contracts

This directory contains the smart contracts for the Zynqtra Web3 networking platform. The contracts are built on Solidity ^0.8.19 and use OpenZeppelin libraries for security and functionality.

## Contract Architecture

The Zynqtra platform consists of 5 main smart contracts:

### 1. ZynqtraProfile.sol
**Purpose**: Manages user profiles, connections, and social features.

**Key Features**:
- ERC721 NFT-based user profiles
- Connection request system with approval workflow
- Points and leveling system
- Activity streak tracking
- Social media integration (LinkedIn, Twitter)
- Profile metadata storage via IPFS

**Main Functions**:
- `createProfile()` - Create a new user profile
- `sendConnectionRequest()` - Send connection request to another user
- `acceptConnectionRequest()` - Accept a connection request
- `awardPoints()` - Award points to users
- `updateEventStats()` - Update user's event statistics

### 2. ZynqtraEvents.sol
**Purpose**: Manages events, registrations, and attendance tracking.

**Key Features**:
- Event creation and management
- Registration with approval workflow
- QR code-based check-in system
- Event challenges and mini-games
- Registration fee handling
- Event status management

**Main Functions**:
- `createEvent()` - Create a new event
- `registerForEvent()` - Register for an event
- `checkIn()` - Check in to an event using QR code
- `markAttendance()` - Mark user attendance
- `addEventChallenge()` - Add challenges to events
- `completeChallenge()` - Complete event challenges

### 3. ZynqtraBadges.sol
**Purpose**: Manages achievement badges and gamification system.

**Key Features**:
- ERC1155 multi-token badge system
- Badge rarity system (Common to Legendary)
- Badge requirements and auto-awarding
- Badge equipping system (max 5 equipped)
- Transferable and non-transferable badges
- Badge collections and categories

**Main Functions**:
- `createBadge()` - Create a new badge
- `awardBadge()` - Award badge to user
- `equipBadge()` - Equip a badge
- `updateUserProgress()` - Update user progress for auto-awarding
- `transferBadge()` - Transfer transferable badges

### 4. ZynqtraChallenges.sol
**Purpose**: Manages challenges and mini-games.

**Key Features**:
- Challenge creation and management
- Mini-game system with leaderboards
- Progress tracking
- Points and badge rewards
- Challenge categories and types
- Score-based point calculation

**Main Functions**:
- `createChallenge()` - Create a new challenge
- `joinChallenge()` - Join a challenge
- `completeChallenge()` - Complete a challenge
- `createMiniGame()` - Create a mini-game
- `submitGameScore()` - Submit game score
- `getGameLeaderboard()` - Get game leaderboard

### 5. ZynqtraMain.sol
**Purpose**: Main integration contract that connects all systems.

**Key Features**:
- Unified interface for all contract interactions
- Cross-contract integration
- Batch operations
- QR code connection system
- Automated reward distribution

**Main Functions**:
- `createProfile()` - Create user profile
- `joinEvent()` - Join an event
- `connectViaQRCode()` - Connect with another user via QR code
- `batchAwardPoints()` - Award points to multiple users
- `batchAwardBadges()` - Award badges to multiple users

## Key Features

### 🎯 Gamification System
- **Points System**: Users earn points for various activities
- **Leveling System**: 10 levels based on total points
- **Streak Tracking**: Daily activity streaks
- **Badge System**: 5 rarity levels with different point values

### 🤝 Social Networking
- **Connection System**: Request-based connections with approval
- **QR Code Connections**: Quick connections via QR scanning
- **Profile Matching**: Interest-based user discovery
- **Social Media Integration**: LinkedIn and Twitter usernames

### 🎪 Event Management
- **Event Creation**: Host events with various types
- **Registration System**: With or without approval
- **QR Check-in**: Secure attendance verification
- **Event Challenges**: Gamified event activities
- **Fee Management**: Registration fees and host payouts

### 🏆 Achievement System
- **Badge Categories**: Achievement, Milestone, Special, Event, Social, Challenge
- **Rarity Levels**: Common, Uncommon, Rare, Epic, Legendary
- **Auto-Awarding**: Automatic badge distribution based on progress
- **Badge Equipping**: Display up to 5 badges on profile

### 🎮 Mini-Games
- **Game Types**: Trivia, Memory, Reaction, Puzzle, Speed
- **Leaderboards**: Top 100 players per game
- **Score-Based Rewards**: Points based on performance
- **High Score Tracking**: Personal best scores

## Security Features

- **ReentrancyGuard**: Protection against reentrancy attacks
- **Ownable**: Admin-only functions for contract management
- **Input Validation**: Comprehensive parameter validation
- **Access Control**: Role-based access to functions
- **Emergency Functions**: Emergency withdrawal and pause capabilities

## Integration Points

### Frontend Integration
The contracts are designed to work seamlessly with the Next.js frontend:

1. **Wallet Connection**: MetaMask integration for user authentication
2. **Event Management**: Create, join, and manage events
3. **Profile System**: Complete profile setup and management
4. **Badge Display**: Show earned and equipped badges
5. **Leaderboards**: Display game and event leaderboards
6. **QR Code System**: Generate and scan QR codes for connections

### Backend Integration
- **IPFS Storage**: Metadata and image storage
- **Event Listeners**: Real-time updates via contract events
- **Analytics**: Track user engagement and platform metrics
- **Notification System**: Alert users of achievements and connections

## Deployment

### Prerequisites
- Solidity ^0.8.19
- OpenZeppelin Contracts
- Hardhat or Remix IDE
- Arbitrum Sepolia testnet

### Deployment Order
1. Deploy ZynqtraProfile
2. Deploy ZynqtraEvents
3. Deploy ZynqtraBadges
4. Deploy ZynqtraChallenges
5. Deploy ZynqtraMain with all contract addresses

### Configuration
- Set correct IPFS metadata URIs
- Configure OpenZeppelin contract addresses
- Set initial admin addresses
- Configure network-specific parameters

## Usage Examples

### Creating a Profile
```solidity
string[] memory interests = ["Web3", "Networking", "Blockchain"];
profileContract.createProfile(
    "John Doe",
    "john@example.com",
    interests,
    "QmHash...",
    "johndoe",
    "johndoe"
);
```

### Creating an Event
```solidity
string[] memory targetInterests = ["Web3", "Networking"];
uint256 eventId = eventsContract.createEvent(
    "Web3 Meetup",
    "Monthly Web3 networking event",
    "San Francisco, CA",
    "QmEventHash...",
    block.timestamp + 7 days,
    block.timestamp + 7 days + 3 hours,
    100,
    0.01 ether,
    ZynqtraEvents.EventType.Networking,
    targetInterests,
    100,
    false
);
```

### Awarding a Badge
```solidity
badgesContract.awardBadge(
    userAddress,
    badgeId,
    "event_completion"
);
```

## Gas Optimization

The contracts are optimized for gas efficiency:
- Batch operations for multiple users
- Efficient data structures
- Minimal storage operations
- Optimized loops and iterations

## Future Enhancements

- **DAO Governance**: Community-driven platform decisions
- **Token Integration**: Native token for rewards and payments
- **Cross-Chain Support**: Multi-chain event and badge support
- **Advanced Analytics**: Detailed user behavior tracking
- **AI Integration**: Smart matching and recommendation systems

## Support

For technical support or questions about the smart contracts, please refer to the project documentation or contact the development team.

## License

MIT License - see LICENSE file for details.
