// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ZynqtraProfile.sol";
import "./ZynqtraEvents.sol";
import "./ZynqtraBadges.sol";
import "./ZynqtraChallenges.sol";

contract ZynqtraMain is Ownable, ReentrancyGuard {
    // Contract addresses
    ZynqtraProfile public profileContract;
    ZynqtraEvents public eventsContract;
    ZynqtraBadges public badgesContract;
    ZynqtraChallenges public challengesContract;

    // Integration events
    event ProfileCreated(address indexed user, string name);
    event EventJoined(address indexed user, uint256 indexed eventId);
    event EventAttended(address indexed user, uint256 indexed eventId, uint256 pointsEarned);
    event BadgeAwarded(address indexed user, uint256 indexed badgeId, string source);
    event ChallengeCompleted(address indexed user, uint256 indexed challengeId, uint256 pointsEarned);
    event PointsAwarded(address indexed user, uint256 points, string reason);
    event ConnectionMade(address indexed user1, address indexed user2);

    // Modifiers
    modifier onlyProfileOwner() {
        require(profileContract.hasProfile(msg.sender), "Profile does not exist");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        require(_addr != msg.sender, "Cannot perform action on yourself");
        _;
    }

    constructor(
        address _profileContract,
        address _eventsContract,
        address _badgesContract,
        address _challengesContract
    ) Ownable(msg.sender) {
        profileContract = ZynqtraProfile(_profileContract);
        eventsContract = ZynqtraEvents(_eventsContract);
        badgesContract = ZynqtraBadges(_badgesContract);
        challengesContract = ZynqtraChallenges(_challengesContract);
    }

    // Profile Management
    function createProfile(
        string memory _name,
        string memory _email,
        string[] memory _interests,
        string memory _ipfsHash,
        string memory _linkedinUsername,
        string memory _twitterUsername
    ) external {
        profileContract.createProfile(
            _name,
            _email,
            _interests,
            _ipfsHash,
            _linkedinUsername,
            _twitterUsername
        );
        
        emit ProfileCreated(msg.sender, _name);
    }

    function updateProfile(
        string memory _name,
        string memory _email,
        string[] memory _interests,
        string memory _ipfsHash,
        string memory _linkedinUsername,
        string memory _twitterUsername
    ) external onlyProfileOwner {
        profileContract.updateProfile(
            _name,
            _email,
            _interests,
            _ipfsHash,
            _linkedinUsername,
            _twitterUsername
        );
    }

    function sendConnectionRequest(address _otherUser) external onlyProfileOwner validAddress(_otherUser) {
        profileContract.sendConnectionRequest(_otherUser);
    }

    function acceptConnectionRequest(address _from) external onlyProfileOwner {
        profileContract.acceptConnectionRequest(_from);
        emit ConnectionMade(_from, msg.sender);
    }

    function rejectConnectionRequest(address _from) external onlyProfileOwner {
        profileContract.rejectConnectionRequest(_from);
    }

    // Event Management
    function createEvent(
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _ipfsMetadata,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxAttendees,
        uint256 _registrationFee,
        ZynqtraEvents.EventType _eventType,
        string[] memory _targetInterests,
        uint256 _pointsReward,
        bool _requiresApproval
    ) external onlyProfileOwner returns (uint256) {
        uint256 eventId = eventsContract.createEvent(
            _title,
            _description,
            _location,
            _ipfsMetadata,
            _startTime,
            _endTime,
            _maxAttendees,
            _registrationFee,
            _eventType,
            _targetInterests,
            _pointsReward,
            _requiresApproval
        );

        // Update profile stats
        profileContract.updateEventStats(msg.sender, true);
        
        return eventId;
    }

    function joinEvent(uint256 _eventId) external payable onlyProfileOwner {
        eventsContract.registerForEvent{value: msg.value}(_eventId);
        emit EventJoined(msg.sender, _eventId);
    }

    function checkInToEvent(uint256 _eventId, string memory _qrCodeHash) external onlyProfileOwner {
        eventsContract.checkIn(_eventId, _qrCodeHash);
    }

    function markEventAttendance(uint256 _eventId, address _participant, uint256 _points) 
        external 
        onlyOwner 
    {
        eventsContract.markAttendance(_eventId, _participant, _points);
        
        // Update profile stats and award points
        profileContract.updateEventStats(_participant, false);
        profileContract.awardPoints(_participant, _points, "Event Attendance");
        
        // Update badge progress
        _updateBadgeProgress(_participant, "events", 1);
        
        emit EventAttended(_participant, _eventId, _points);
    }

    // Badge Management
    function createBadge(
        string memory _name,
        string memory _description,
        string memory _ipfsMetadata,
        ZynqtraBadges.BadgeType _badgeType,
        ZynqtraBadges.BadgeRarity _rarity,
        uint256 _pointsRequired,
        uint256 _maxSupply,
        bool _isTransferable,
        string memory _collection
    ) external onlyOwner returns (uint256) {
        return badgesContract.createBadge(
            _name,
            _description,
            _ipfsMetadata,
            _badgeType,
            _rarity,
            _pointsRequired,
            _maxSupply,
            _isTransferable,
            _collection
        );
    }

    function awardBadge(address _user, uint256 _badgeId, string memory _source) external onlyOwner {
        badgesContract.awardBadge(_user, _badgeId, _source);
        
        // Award points for badge
        ZynqtraBadges.Badge memory badge = badgesContract.getBadge(_badgeId);
        uint256 badgePoints = _calculateBadgePoints(badge.rarity);
        profileContract.awardPoints(_user, badgePoints, "Badge Earned");
        
        emit BadgeAwarded(_user, _badgeId, _source);
    }

    function equipBadge(uint256 _badgeId) external onlyProfileOwner {
        badgesContract.equipBadge(_badgeId);
    }

    function unequipBadge(uint256 _badgeId) external onlyProfileOwner {
        badgesContract.unequipBadge(_badgeId);
    }

    // Challenge Management
    function createChallenge(
        string memory _title,
        string memory _description,
        ZynqtraChallenges.ChallengeType _challengeType,
        uint256 _pointsReward,
        uint256 _badgeReward,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxParticipants,
        bool _requiresEvent,
        uint256 _requiredEventId,
        string[] memory _requirements,
        string memory _ipfsMetadata,
        string memory _category
    ) external onlyOwner returns (uint256) {
        return challengesContract.createChallenge(
            _title,
            _description,
            _challengeType,
            _pointsReward,
            _badgeReward,
            _startTime,
            _endTime,
            _maxParticipants,
            _requiresEvent,
            _requiredEventId,
            _requirements,
            _ipfsMetadata,
            _category
        );
    }

    function joinChallenge(uint256 _challengeId) external onlyProfileOwner {
        challengesContract.joinChallenge(_challengeId);
    }

    function completeChallenge(uint256 _challengeId) external onlyProfileOwner {
        challengesContract.completeChallenge(_challengeId);
        
        // Award points and update progress
        ZynqtraChallenges.Challenge memory challenge = challengesContract.getChallenge(_challengeId);
        profileContract.awardPoints(msg.sender, challenge.pointsReward, "Challenge Completed");
        
        // Award badge if specified
        if (challenge.badgeReward > 0) {
            badgesContract.awardBadge(msg.sender, challenge.badgeReward, "challenge");
        }
        
        // Update badge progress
        _updateBadgeProgress(msg.sender, "challenges", 1);
        
        emit ChallengeCompleted(msg.sender, _challengeId, challenge.pointsReward);
    }

    // Mini-Game Management
    function createMiniGame(
        string memory _name,
        ZynqtraChallenges.MiniGameType _gameType,
        uint256 _pointsReward,
        uint256 _maxScore,
        string memory _gameData
    ) external onlyOwner returns (uint256) {
        return challengesContract.createMiniGame(_name, _gameType, _pointsReward, _maxScore, _gameData);
    }

    function submitGameScore(uint256 _gameId, uint256 _score) external onlyProfileOwner {
        challengesContract.submitGameScore(_gameId, _score);
        
        // Award points based on score
        ZynqtraChallenges.MiniGame memory game = challengesContract.getMiniGame(_gameId);
        uint256 pointsEarned = _calculateGamePoints(game.pointsReward, _score, game.maxScore);
        
        if (pointsEarned > 0) {
            profileContract.awardPoints(msg.sender, pointsEarned, "Mini-Game Score");
            emit PointsAwarded(msg.sender, pointsEarned, "Mini-Game Score");
        }
    }

    // QR Code Connection System
    function connectViaQRCode(string memory _qrCodeHash, address _otherUser) 
        external 
        onlyProfileOwner 
        validAddress(_otherUser) 
    {
        require(profileContract.hasProfile(_otherUser), "Other user must have a profile");
        require(!profileContract.isConnected(msg.sender, _otherUser), "Already connected");
        
        // Create connection
        profileContract.sendConnectionRequest(_otherUser);
        profileContract.acceptConnectionRequest(_otherUser);
        
        // Award points for QR connection
        profileContract.awardPoints(msg.sender, 25, "QR Code Connection");
        profileContract.awardPoints(_otherUser, 25, "QR Code Connection");
        
        // Update badge progress
        _updateBadgeProgress(msg.sender, "connections", 1);
        _updateBadgeProgress(_otherUser, "connections", 1);
        
        emit ConnectionMade(msg.sender, _otherUser);
    }

    // Batch Operations
    function batchAwardPoints(
        address[] memory _users,
        uint256[] memory _points,
        string memory _reason
    ) external onlyOwner {
        require(_users.length == _points.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _users.length; i++) {
            profileContract.awardPoints(_users[i], _points[i], _reason);
            emit PointsAwarded(_users[i], _points[i], _reason);
        }
    }

    function batchAwardBadges(
        address[] memory _users,
        uint256[] memory _badgeIds,
        string memory _source
    ) external onlyOwner {
        badgesContract.batchAwardBadges(_users, _badgeIds, _source);
        
        for (uint256 i = 0; i < _users.length; i++) {
            emit BadgeAwarded(_users[i], _badgeIds[i], _source);
        }
    }

    // View Functions
    function getUserProfile(address _user) external view returns (ZynqtraProfile.UserProfile memory) {
        return profileContract.getProfile(_user);
    }

    function getUserStats(address _user) external view returns (
        uint256 points,
        uint256 level,
        uint256 streak,
        uint256 connections,
        uint256 eventsAttended,
        uint256 eventsHosted
    ) {
        return profileContract.getUserStats(_user);
    }

    function getUserBadges(address _user) external view returns (uint256[] memory) {
        return badgesContract.getUserBadges(_user);
    }

    function getUserChallenges(address _user) external view returns (uint256[] memory) {
        return challengesContract.getUserChallenges(_user);
    }

    function getUserCompletedChallenges(address _user) external view returns (uint256[] memory) {
        return challengesContract.getUserCompletedChallenges(_user);
    }

    function getEvent(uint256 _eventId) external view returns (ZynqtraEvents.Event memory) {
        return eventsContract.getEvent(_eventId);
    }

    function getBadge(uint256 _badgeId) external view returns (ZynqtraBadges.Badge memory) {
        return badgesContract.getBadge(_badgeId);
    }

    function getChallenge(uint256 _challengeId) external view returns (ZynqtraChallenges.Challenge memory) {
        return challengesContract.getChallenge(_challengeId);
    }

    // Internal Functions
    function _updateBadgeProgress(address _user, string memory _requirementType, uint256 _increment) internal {
        uint256 currentProgress = badgesContract.getUserProgress(_user, _requirementType);
        badgesContract.updateUserProgress(_user, _requirementType, currentProgress + _increment);
    }

    function _calculateBadgePoints(ZynqtraBadges.BadgeRarity _rarity) internal pure returns (uint256) {
        if (_rarity == ZynqtraBadges.BadgeRarity.Common) return 10;
        if (_rarity == ZynqtraBadges.BadgeRarity.Uncommon) return 25;
        if (_rarity == ZynqtraBadges.BadgeRarity.Rare) return 50;
        if (_rarity == ZynqtraBadges.BadgeRarity.Epic) return 100;
        if (_rarity == ZynqtraBadges.BadgeRarity.Legendary) return 250;
        return 10;
    }

    function _calculateGamePoints(uint256 _baseReward, uint256 _score, uint256 _maxScore) 
        internal 
        pure 
        returns (uint256) 
    {
        uint256 scorePercentage = (_score * 100) / _maxScore;
        
        if (scorePercentage >= 90) return _baseReward;
        if (scorePercentage >= 80) return (_baseReward * 80) / 100;
        if (scorePercentage >= 70) return (_baseReward * 60) / 100;
        if (scorePercentage >= 60) return (_baseReward * 40) / 100;
        if (scorePercentage >= 50) return (_baseReward * 20) / 100;
        
        return 0;
    }

    // Contract Management
    function updateContractAddresses(
        address _profileContract,
        address _eventsContract,
        address _badgesContract,
        address _challengesContract
    ) external onlyOwner {
        profileContract = ZynqtraProfile(_profileContract);
        eventsContract = ZynqtraEvents(_eventsContract);
        badgesContract = ZynqtraBadges(_badgesContract);
        challengesContract = ZynqtraChallenges(_challengesContract);
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function pauseAllContracts() external onlyOwner {
        // This would require implementing pausable functionality in each contract
        // For now, this is a placeholder for future implementation
    }
}
