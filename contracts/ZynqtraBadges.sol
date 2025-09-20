// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ZynqtraBadges is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _badgeIds;

    struct Badge {
        string name;
        string description;
        string ipfsMetadata;
        uint256 pointsRequired;
        bool isActive;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(uint256 => bool)) public userBadges;
    mapping(address => uint256[]) public userBadgeList;

    event BadgeCreated(uint256 indexed badgeId, string name);
    event BadgeAwarded(address indexed user, uint256 indexed badgeId);

    constructor() ERC1155("https://api.zynqtra.com/badge/{id}.json") {}

    function createBadge(
        string memory _name,
        string memory _description,
        string memory _ipfsMetadata,
        uint256 _pointsRequired
    ) external onlyOwner returns (uint256) {
        _badgeIds.increment();
        uint256 newBadgeId = _badgeIds.current();
        
        badges[newBadgeId] = Badge({
            name: _name,
            description: _description,
            ipfsMetadata: _ipfsMetadata,
            pointsRequired: _pointsRequired,
            isActive: true
        });
        
        emit BadgeCreated(newBadgeId, _name);
        return newBadgeId;
    }

    function awardBadge(address _user, uint256 _badgeId) external onlyOwner {
        require(badges[_badgeId].isActive, "Badge is not active");
        require(!userBadges[_user][_badgeId], "User already has this badge");
        
        userBadges[_user][_badgeId] = true;
        userBadgeList[_user].push(_badgeId);
        
        _mint(_user, _badgeId, 1, "");
        
        emit BadgeAwarded(_user, _badgeId);
    }

    function getUserBadges(address _user) external view returns (uint256[] memory) {
        return userBadgeList[_user];
    }

    function getBadge(uint256 _badgeId) external view returns (Badge memory) {
        return badges[_badgeId];
    }

    function hasBadge(address _user, uint256 _badgeId) external view returns (bool) {
        return userBadges[_user][_badgeId];
    }
}
