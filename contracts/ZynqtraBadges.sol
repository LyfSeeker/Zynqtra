// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ZynqtraBadges is ERC1155, Ownable, ReentrancyGuard {
    uint256 private _badgeIds;

    enum BadgeType {
        Achievement,
        Milestone,
        Special,
        Event,
        Social,
        Challenge
    }

    enum BadgeRarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary
    }

    struct Badge {
        string name;
        string description;
        string ipfsMetadata;
        BadgeType badgeType;
        BadgeRarity rarity;
        uint256 pointsRequired;
        uint256 maxSupply;
        uint256 currentSupply;
        bool isActive;
        bool isTransferable;
        uint256 createdAt;
        address creator;
    }

    struct BadgeRequirement {
        uint256 badgeId;
        string requirementType; // "points", "connections", "events", "challenges", "streak"
        uint256 requirementValue;
        bool isCompleted;
    }

    struct UserBadgeData {
        uint256 badgeId;
        uint256 earnedAt;
        uint256 pointsEarned;
        string source; // "manual", "auto", "event", "challenge"
        bool isEquipped;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(uint256 => UserBadgeData)) public userBadgeData;
    mapping(address => uint256[]) public userBadgeList;
    mapping(address => uint256[]) public userEquippedBadges;
    mapping(uint256 => BadgeRequirement[]) public badgeRequirements;
    mapping(address => mapping(string => uint256)) public userProgress; // Track progress for auto-awarding
    
    // Badge categories and collections
    mapping(BadgeType => uint256[]) public badgesByType;
    mapping(BadgeRarity => uint256[]) public badgesByRarity;
    mapping(string => uint256[]) public badgesByCollection; // e.g., "networking", "events", "challenges"
    
    // Events
    event BadgeCreated(uint256 indexed badgeId, string name, BadgeType badgeType, BadgeRarity rarity);
    event BadgeAwarded(address indexed user, uint256 indexed badgeId, string source, uint256 pointsEarned);
    event BadgeEquipped(address indexed user, uint256 indexed badgeId);
    event BadgeUnequipped(address indexed user, uint256 indexed badgeId);
    event BadgeTransferred(address indexed from, address indexed to, uint256 indexed badgeId, uint256 amount);
    event BadgeRequirementAdded(uint256 indexed badgeId, string requirementType, uint256 requirementValue);
    event ProgressUpdated(address indexed user, string requirementType, uint256 newValue);

    // Modifiers
    modifier badgeExists(uint256 _badgeId) {
        require(badges[_badgeId].createdAt != 0, "Badge does not exist");
        _;
    }

    modifier badgeActive(uint256 _badgeId) {
        require(badges[_badgeId].isActive, "Badge is not active");
        _;
    }

    constructor() ERC1155("https://api.zynqtra.com/badge/{id}.json") Ownable(msg.sender) {}

    function createBadge(
        string memory _name,
        string memory _description,
        string memory _ipfsMetadata,
        BadgeType _badgeType,
        BadgeRarity _rarity,
        uint256 _pointsRequired,
        uint256 _maxSupply,
        bool _isTransferable,
        string memory _collection
    ) external onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_maxSupply > 0, "Max supply must be greater than 0");

        _badgeIds++;
        uint256 newBadgeId = _badgeIds;
        
        badges[newBadgeId] = Badge({
            name: _name,
            description: _description,
            ipfsMetadata: _ipfsMetadata,
            badgeType: _badgeType,
            rarity: _rarity,
            pointsRequired: _pointsRequired,
            maxSupply: _maxSupply,
            currentSupply: 0,
            isActive: true,
            isTransferable: _isTransferable,
            createdAt: block.timestamp,
            creator: msg.sender
        });

        badgesByType[_badgeType].push(newBadgeId);
        badgesByRarity[_rarity].push(newBadgeId);
        badgesByCollection[_collection].push(newBadgeId);
        
        emit BadgeCreated(newBadgeId, _name, _badgeType, _rarity);
        return newBadgeId;
    }

    function addBadgeRequirement(
        uint256 _badgeId,
        string memory _requirementType,
        uint256 _requirementValue
    ) external onlyOwner badgeExists(_badgeId) {
        require(bytes(_requirementType).length > 0, "Requirement type cannot be empty");
        require(_requirementValue > 0, "Requirement value must be greater than 0");

        badgeRequirements[_badgeId].push(BadgeRequirement({
            badgeId: _badgeId,
            requirementType: _requirementType,
            requirementValue: _requirementValue,
            isCompleted: false
        }));

        emit BadgeRequirementAdded(_badgeId, _requirementType, _requirementValue);
    }

    function awardBadge(address _user, uint256 _badgeId, string memory _source) 
        external 
        onlyOwner 
        badgeExists(_badgeId) 
        badgeActive(_badgeId) 
    {
        _awardBadge(_user, _badgeId, _source);
    }

    function _awardBadge(address _user, uint256 _badgeId, string memory _source) 
        internal 
        badgeExists(_badgeId) 
        badgeActive(_badgeId) 
    {
        require(userBadgeData[_user][_badgeId].badgeId == 0, "User already has this badge");
        require(badges[_badgeId].currentSupply < badges[_badgeId].maxSupply, "Badge supply exhausted");
        
        uint256 pointsEarned = _calculateBadgePoints(_badgeId);
        
        userBadgeData[_user][_badgeId] = UserBadgeData({
            badgeId: _badgeId,
            earnedAt: block.timestamp,
            pointsEarned: pointsEarned,
            source: _source,
            isEquipped: false
        });
        
        userBadgeList[_user].push(_badgeId);
        badges[_badgeId].currentSupply++;
        
        _mint(_user, _badgeId, 1, "");
        
        emit BadgeAwarded(_user, _badgeId, _source, pointsEarned);
    }

    function checkAndAwardBadge(address _user, uint256 _badgeId) 
        external 
        onlyOwner 
        badgeExists(_badgeId) 
        badgeActive(_badgeId) 
    {
        require(userBadgeData[_user][_badgeId].badgeId == 0, "User already has this badge");
        require(_checkBadgeRequirements(_user, _badgeId), "Badge requirements not met");
        
        _awardBadge(_user, _badgeId, "auto");
    }

    function updateUserProgress(
        address _user,
        string memory _requirementType,
        uint256 _newValue
    ) external onlyOwner {
        userProgress[_user][_requirementType] = _newValue;
        emit ProgressUpdated(_user, _requirementType, _newValue);
        
        // Check for auto-awardable badges
        _checkAutoAwardableBadges(_user);
    }

    function equipBadge(uint256 _badgeId) external badgeExists(_badgeId) {
        require(userBadgeData[msg.sender][_badgeId].badgeId != 0, "User does not have this badge");
        require(!userBadgeData[msg.sender][_badgeId].isEquipped, "Badge already equipped");
        require(userEquippedBadges[msg.sender].length < 5, "Maximum 5 badges can be equipped");

        userBadgeData[msg.sender][_badgeId].isEquipped = true;
        userEquippedBadges[msg.sender].push(_badgeId);

        emit BadgeEquipped(msg.sender, _badgeId);
    }

    function unequipBadge(uint256 _badgeId) external badgeExists(_badgeId) {
        require(userBadgeData[msg.sender][_badgeId].isEquipped, "Badge not equipped");

        userBadgeData[msg.sender][_badgeId].isEquipped = false;
        _removeFromEquippedList(msg.sender, _badgeId);

        emit BadgeUnequipped(msg.sender, _badgeId);
    }

    function transferBadge(
        address _to,
        uint256 _badgeId,
        uint256 _amount
    ) external badgeExists(_badgeId) {
        require(badges[_badgeId].isTransferable, "Badge is not transferable");
        require(balanceOf(msg.sender, _badgeId) >= _amount, "Insufficient badge balance");
        
        // Update user badge data
        if (userBadgeData[msg.sender][_badgeId].isEquipped) {
            userBadgeData[msg.sender][_badgeId].isEquipped = false;
            _removeFromEquippedList(msg.sender, _badgeId);
        }
        
        _safeTransferFrom(msg.sender, _to, _badgeId, _amount, "");
        
        emit BadgeTransferred(msg.sender, _to, _badgeId, _amount);
    }

    function batchAwardBadges(
        address[] memory _users,
        uint256[] memory _badgeIdList,
        string memory _source
    ) external onlyOwner {
        require(_users.length == _badgeIdList.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _users.length; i++) {
            if (userBadgeData[_users[i]][_badgeIdList[i]].badgeId == 0) {
                _awardBadge(_users[i], _badgeIdList[i], _source);
            }
        }
    }

    // View functions
    function getBadge(uint256 _badgeId) external view badgeExists(_badgeId) returns (Badge memory) {
        return badges[_badgeId];
    }

    function getUserBadges(address _user) external view returns (uint256[] memory) {
        return userBadgeList[_user];
    }

    function getUserEquippedBadges(address _user) external view returns (uint256[] memory) {
        return userEquippedBadges[_user];
    }

    function getUserBadgeData(address _user, uint256 _badgeId) 
        external 
        view 
        badgeExists(_badgeId) 
        returns (UserBadgeData memory) 
    {
        return userBadgeData[_user][_badgeId];
    }

    function hasBadge(address _user, uint256 _badgeId) external view badgeExists(_badgeId) returns (bool) {
        return userBadgeData[_user][_badgeId].badgeId != 0;
    }

    function getBadgeRequirements(uint256 _badgeId) 
        external 
        view 
        badgeExists(_badgeId) 
        returns (BadgeRequirement[] memory) 
    {
        return badgeRequirements[_badgeId];
    }

    function getBadgesByType(BadgeType _badgeType) external view returns (uint256[] memory) {
        return badgesByType[_badgeType];
    }

    function getBadgesByRarity(BadgeRarity _rarity) external view returns (uint256[] memory) {
        return badgesByRarity[_rarity];
    }

    function getBadgesByCollection(string memory _collection) external view returns (uint256[] memory) {
        return badgesByCollection[_collection];
    }

    function getUserProgress(address _user, string memory _requirementType) 
        external 
        view 
        returns (uint256) 
    {
        return userProgress[_user][_requirementType];
    }

    function getBadgeStats(uint256 _badgeId) 
        external 
        view 
        badgeExists(_badgeId) 
        returns (
            uint256 totalSupply,
            uint256 maxSupply,
            uint256 remainingSupply,
            BadgeRarity rarity
        ) 
    {
        Badge memory badge = badges[_badgeId];
        return (
            badge.currentSupply,
            badge.maxSupply,
            badge.maxSupply - badge.currentSupply,
            badge.rarity
        );
    }

    // Internal functions
    function _calculateBadgePoints(uint256 _badgeId) internal view returns (uint256) {
        BadgeRarity rarity = badges[_badgeId].rarity;
        
        if (rarity == BadgeRarity.Common) return 10;
        if (rarity == BadgeRarity.Uncommon) return 25;
        if (rarity == BadgeRarity.Rare) return 50;
        if (rarity == BadgeRarity.Epic) return 100;
        if (rarity == BadgeRarity.Legendary) return 250;
        
        return 10; // Default
    }

    function _checkBadgeRequirements(address _user, uint256 _badgeId) internal view returns (bool) {
        BadgeRequirement[] memory requirements = badgeRequirements[_badgeId];
        
        for (uint256 i = 0; i < requirements.length; i++) {
            string memory reqType = requirements[i].requirementType;
            uint256 requiredValue = requirements[i].requirementValue;
            uint256 userValue = userProgress[_user][reqType];
            
            if (userValue < requiredValue) {
                return false;
            }
        }
        
        return true;
    }

    function _checkAutoAwardableBadges(address _user) internal {
        // Check all badges for auto-awarding
        for (uint256 i = 1; i <= _badgeIds; i++) {
            if (badges[i].isActive && 
                userBadgeData[_user][i].badgeId == 0 && 
                _checkBadgeRequirements(_user, i)) {
                _awardBadge(_user, i, "auto");
            }
        }
    }

    function _removeFromEquippedList(address _user, uint256 _badgeId) internal {
        uint256[] storage equippedList = userEquippedBadges[_user];
        for (uint256 i = 0; i < equippedList.length; i++) {
            if (equippedList[i] == _badgeId) {
                equippedList[i] = equippedList[equippedList.length - 1];
                equippedList.pop();
                break;
            }
        }
    }

    // Override to handle badge transfers
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override {
        super._update(from, to, ids, values);
        
        // If transferring from a user (not minting), check if badge is transferable
        if (from != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                require(badges[ids[i]].isTransferable, "Badge is not transferable");
            }
        }
    }
}
