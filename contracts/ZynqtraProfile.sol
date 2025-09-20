// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ZynqtraProfile is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;

    struct UserProfile {
        string name;
        string email;
        string[] interests;
        uint256 totalPoints;
        uint256 connectionsCount;
        uint256 eventsAttended;
        uint256 eventsHosted;
        string ipfsHash; // IPFS hash for additional profile data
        string linkedinUsername;
        string twitterUsername;
        bool isActive;
        uint256 createdAt;
        uint256 lastActiveAt;
    }

    struct ConnectionRequest {
        address from;
        address to;
        uint256 timestamp;
        bool isAccepted;
        bool isRejected;
    }

    mapping(address => UserProfile) public profiles;
    mapping(address => bool) public hasProfile;
    mapping(address => mapping(address => bool)) public connections;
    mapping(address => mapping(address => bool)) public connectionRequests;
    mapping(address => address[]) public userConnections;
    mapping(address => ConnectionRequest[]) public pendingRequests;
    
    // Points and rewards system
    mapping(address => uint256) public userPoints;
    mapping(address => uint256) public userLevel;
    mapping(address => uint256) public streakCount;
    mapping(address => uint256) public lastActivityDate;

    // Events
    event ProfileCreated(address indexed user, string name, uint256 tokenId);
    event ProfileUpdated(address indexed user, string name);
    event ConnectionRequestSent(address indexed from, address indexed to);
    event ConnectionRequestAccepted(address indexed from, address indexed to);
    event ConnectionRequestRejected(address indexed from, address indexed to);
    event ConnectionRemoved(address indexed user1, address indexed user2);
    event PointsAwarded(address indexed user, uint256 points, string reason);
    event LevelUp(address indexed user, uint256 newLevel);
    event StreakUpdated(address indexed user, uint256 streakCount);

    // Modifiers
    modifier onlyProfileOwner() {
        require(hasProfile[msg.sender], "Profile does not exist");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        require(_addr != msg.sender, "Cannot perform action on yourself");
        _;
    }

    constructor() ERC721("ZynqtraProfile", "ZYN") Ownable(msg.sender) {}

    function createProfile(
        string memory _name,
        string memory _email,
        string[] memory _interests,
        string memory _ipfsHash,
        string memory _linkedinUsername,
        string memory _twitterUsername
    ) external {
        require(!hasProfile[msg.sender], "Profile already exists");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_interests.length > 0, "Must have at least one interest");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        profiles[msg.sender] = UserProfile({
            name: _name,
            email: _email,
            interests: _interests,
            totalPoints: 0,
            connectionsCount: 0,
            eventsAttended: 0,
            eventsHosted: 0,
            ipfsHash: _ipfsHash,
            linkedinUsername: _linkedinUsername,
            twitterUsername: _twitterUsername,
            isActive: true,
            createdAt: block.timestamp,
            lastActiveAt: block.timestamp
        });
        
        hasProfile[msg.sender] = true;
        userPoints[msg.sender] = 0;
        userLevel[msg.sender] = 1;
        streakCount[msg.sender] = 0;
        lastActivityDate[msg.sender] = block.timestamp;
        
        _mint(msg.sender, newTokenId);
        
        // Award initial points for profile creation
        _awardPoints(msg.sender, 50, "Profile Creation");
        
        emit ProfileCreated(msg.sender, _name, newTokenId);
    }

    function updateProfile(
        string memory _name,
        string memory _email,
        string[] memory _interests,
        string memory _ipfsHash,
        string memory _linkedinUsername,
        string memory _twitterUsername
    ) external onlyProfileOwner {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_interests.length > 0, "Must have at least one interest");
        
        UserProfile storage profile = profiles[msg.sender];
        profile.name = _name;
        profile.email = _email;
        profile.interests = _interests;
        profile.ipfsHash = _ipfsHash;
        profile.linkedinUsername = _linkedinUsername;
        profile.twitterUsername = _twitterUsername;
        profile.lastActiveAt = block.timestamp;
        
        emit ProfileUpdated(msg.sender, _name);
    }

    function sendConnectionRequest(address _otherUser) external onlyProfileOwner validAddress(_otherUser) {
        require(hasProfile[_otherUser], "Other user must have a profile");
        require(!connections[msg.sender][_otherUser], "Already connected");
        require(!connectionRequests[msg.sender][_otherUser], "Request already sent");
        
        connectionRequests[msg.sender][_otherUser] = true;
        pendingRequests[_otherUser].push(ConnectionRequest({
            from: msg.sender,
            to: _otherUser,
            timestamp: block.timestamp,
            isAccepted: false,
            isRejected: false
        }));
        
        emit ConnectionRequestSent(msg.sender, _otherUser);
    }

    function acceptConnectionRequest(address _from) external onlyProfileOwner {
        require(connectionRequests[_from][msg.sender], "No pending request");
        require(!connections[msg.sender][_from], "Already connected");
        
        // Remove from pending requests
        _removePendingRequest(_from, msg.sender);
        
        // Create connection
        connections[msg.sender][_from] = true;
        connections[_from][msg.sender] = true;
        
        userConnections[msg.sender].push(_from);
        userConnections[_from].push(msg.sender);
        
        profiles[msg.sender].connectionsCount++;
        profiles[_from].connectionsCount++;
        
        // Award points for making connections
        _awardPoints(msg.sender, 25, "Connection Made");
        _awardPoints(_from, 25, "Connection Made");
        
        emit ConnectionRequestAccepted(_from, msg.sender);
    }

    function rejectConnectionRequest(address _from) external onlyProfileOwner {
        require(connectionRequests[_from][msg.sender], "No pending request");
        
        _removePendingRequest(_from, msg.sender);
        connectionRequests[_from][msg.sender] = false;
        
        emit ConnectionRequestRejected(_from, msg.sender);
    }

    function removeConnection(address _otherUser) external onlyProfileOwner validAddress(_otherUser) {
        require(connections[msg.sender][_otherUser], "Not connected");
        
        connections[msg.sender][_otherUser] = false;
        connections[_otherUser][msg.sender] = false;
        
        _removeFromConnectionsList(msg.sender, _otherUser);
        _removeFromConnectionsList(_otherUser, msg.sender);
        
        profiles[msg.sender].connectionsCount--;
        profiles[_otherUser].connectionsCount--;
        
        emit ConnectionRemoved(msg.sender, _otherUser);
    }

    function awardPoints(address _user, uint256 _points, string memory _reason) external onlyOwner {
        require(hasProfile[_user], "User must have a profile");
        _awardPoints(_user, _points, _reason);
    }

    function updateEventStats(address _user, bool _isHost) external onlyOwner {
        require(hasProfile[_user], "User must have a profile");
        
        if (_isHost) {
            profiles[_user].eventsHosted++;
            _awardPoints(_user, 100, "Event Hosted");
        } else {
            profiles[_user].eventsAttended++;
            _awardPoints(_user, 50, "Event Attended");
        }
        
        _updateStreak(_user);
    }

    function getProfile(address _user) external view returns (UserProfile memory) {
        require(hasProfile[_user], "Profile does not exist");
        return profiles[_user];
    }

    function getUserConnections(address _user) external view returns (address[] memory) {
        return userConnections[_user];
    }

    function getPendingRequests(address _user) external view returns (ConnectionRequest[] memory) {
        return pendingRequests[_user];
    }

    function isConnected(address _user1, address _user2) external view returns (bool) {
        return connections[_user1][_user2];
    }

    function getUserStats(address _user) external view returns (
        uint256 points,
        uint256 level,
        uint256 streak,
        uint256 connectionCount,
        uint256 eventsAttended,
        uint256 eventsHosted
    ) {
        require(hasProfile[_user], "Profile does not exist");
        return (
            userPoints[_user],
            userLevel[_user],
            streakCount[_user],
            profiles[_user].connectionsCount,
            profiles[_user].eventsAttended,
            profiles[_user].eventsHosted
        );
    }

    // Internal functions
    function _awardPoints(address _user, uint256 _points, string memory _reason) internal {
        userPoints[_user] += _points;
        profiles[_user].totalPoints += _points;
        
        // Check for level up
        uint256 newLevel = _calculateLevel(userPoints[_user]);
        if (newLevel > userLevel[_user]) {
            userLevel[_user] = newLevel;
            emit LevelUp(_user, newLevel);
        }
        
        emit PointsAwarded(_user, _points, _reason);
    }

    function _calculateLevel(uint256 _points) internal pure returns (uint256) {
        if (_points < 100) return 1;
        if (_points < 500) return 2;
        if (_points < 1000) return 3;
        if (_points < 2500) return 4;
        if (_points < 5000) return 5;
        if (_points < 10000) return 6;
        if (_points < 25000) return 7;
        if (_points < 50000) return 8;
        if (_points < 100000) return 9;
        return 10;
    }

    function _updateStreak(address _user) internal {
        uint256 today = block.timestamp / 1 days;
        uint256 lastActivity = lastActivityDate[_user] / 1 days;
        
        if (today == lastActivity + 1) {
            streakCount[_user]++;
        } else if (today > lastActivity + 1) {
            streakCount[_user] = 1;
        }
        
        lastActivityDate[_user] = block.timestamp;
        emit StreakUpdated(_user, streakCount[_user]);
    }

    function _removePendingRequest(address _from, address _to) internal {
        ConnectionRequest[] storage requests = pendingRequests[_to];
        for (uint256 i = 0; i < requests.length; i++) {
            if (requests[i].from == _from) {
                requests[i] = requests[requests.length - 1];
                requests.pop();
                break;
            }
        }
    }

    function _removeFromConnectionsList(address _user, address _connection) internal {
        address[] storage connectionsList = userConnections[_user];
        for (uint256 i = 0; i < connectionsList.length; i++) {
            if (connectionsList[i] == _connection) {
                connectionsList[i] = connectionsList[connectionsList.length - 1];
                connectionsList.pop();
                break;
            }
        }
    }
}
