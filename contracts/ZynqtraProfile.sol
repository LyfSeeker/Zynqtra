// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ZynqtraProfile is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct UserProfile {
        string name;
        string email;
        string[] interests;
        uint256 totalPoints;
        uint256 connectionsCount;
        string ipfsHash; // IPFS hash for additional profile data
        bool isActive;
    }

    mapping(address => UserProfile) public profiles;
    mapping(address => bool) public hasProfile;
    mapping(address => mapping(address => bool)) public connections;

    event ProfileCreated(address indexed user, string name);
    event ProfileUpdated(address indexed user, string name);
    event ConnectionMade(address indexed user1, address indexed user2);
    event PointsAwarded(address indexed user, uint256 points);

    constructor() ERC721("ZynqtraProfile", "ZYN") {}

    function createProfile(
        string memory _name,
        string memory _email,
        string[] memory _interests,
        string memory _ipfsHash
    ) external {
        require(!hasProfile[msg.sender], "Profile already exists");
        
        profiles[msg.sender] = UserProfile({
            name: _name,
            email: _email,
            interests: _interests,
            totalPoints: 0,
            connectionsCount: 0,
            ipfsHash: _ipfsHash,
            isActive: true
        });
        
        hasProfile[msg.sender] = true;
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        
        emit ProfileCreated(msg.sender, _name);
    }

    function updateProfile(
        string memory _name,
        string memory _email,
        string[] memory _interests,
        string memory _ipfsHash
    ) external {
        require(hasProfile[msg.sender], "Profile does not exist");
        
        UserProfile storage profile = profiles[msg.sender];
        profile.name = _name;
        profile.email = _email;
        profile.interests = _interests;
        profile.ipfsHash = _ipfsHash;
        
        emit ProfileUpdated(msg.sender, _name);
    }

    function makeConnection(address _otherUser) external {
        require(hasProfile[msg.sender], "You must have a profile");
        require(hasProfile[_otherUser], "Other user must have a profile");
        require(!connections[msg.sender][_otherUser], "Already connected");
        require(msg.sender != _otherUser, "Cannot connect to yourself");
        
        connections[msg.sender][_otherUser] = true;
        connections[_otherUser][msg.sender] = true;
        
        profiles[msg.sender].connectionsCount++;
        profiles[_otherUser].connectionsCount++;
        
        emit ConnectionMade(msg.sender, _otherUser);
    }

    function awardPoints(address _user, uint256 _points) external onlyOwner {
        require(hasProfile[_user], "User must have a profile");
        profiles[_user].totalPoints += _points;
        emit PointsAwarded(_user, _points);
    }

    function getProfile(address _user) external view returns (UserProfile memory) {
        require(hasProfile[_user], "Profile does not exist");
        return profiles[_user];
    }

    function isConnected(address _user1, address _user2) external view returns (bool) {
        return connections[_user1][_user2];
    }
}
