// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ZynqtraChallenges is Ownable, ReentrancyGuard {
    uint256 private _challengeIds;

    enum ChallengeType {
        Networking,
        Event,
        Social,
        Skill,
        Streak,
        MiniGame
    }

    enum ChallengeStatus {
        Active,
        Paused,
        Completed,
        Expired
    }

    enum MiniGameType {
        Trivia,
        Memory,
        Reaction,
        Puzzle,
        Speed
    }

    struct Challenge {
        uint256 challengeId;
        string title;
        string description;
        ChallengeType challengeType;
        ChallengeStatus status;
        uint256 pointsReward;
        uint256 badgeReward;
        uint256 startTime;
        uint256 endTime;
        uint256 maxParticipants;
        uint256 currentParticipants;
        bool requiresEvent;
        uint256 requiredEventId;
        string[] requirements;
        string ipfsMetadata;
        address creator;
        uint256 createdAt;
    }

    struct UserChallengeProgress {
        uint256 challengeId;
        address user;
        bool isParticipating;
        bool isCompleted;
        uint256 progress;
        uint256 maxProgress;
        uint256 completedAt;
        uint256 pointsEarned;
        string[] submittedData; // For challenges that require submissions
    }

    struct MiniGame {
        uint256 gameId;
        string name;
        MiniGameType gameType;
        uint256 pointsReward;
        uint256 maxScore;
        bool isActive;
        string gameData; // JSON string with game configuration
        address creator;
        uint256 createdAt;
    }

    struct UserGameScore {
        uint256 gameId;
        address user;
        uint256 score;
        uint256 pointsEarned;
        uint256 playedAt;
        bool isHighScore;
    }

    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => mapping(address => UserChallengeProgress)) public userChallengeProgress;
    mapping(address => uint256[]) public userChallenges;
    mapping(address => uint256[]) public userCompletedChallenges;
    
    // Mini-games
    mapping(uint256 => MiniGame) public miniGames;
    mapping(uint256 => mapping(address => UserGameScore)) public userGameScores;
    mapping(uint256 => address[]) public gameLeaderboard;
    mapping(address => uint256[]) public userPlayedGames;
    
    // Challenge categories
    mapping(ChallengeType => uint256[]) public challengesByType;
    mapping(string => uint256[]) public challengesByCategory; // e.g., "networking", "events"
    
    // Events
    event ChallengeCreated(uint256 indexed challengeId, string title, ChallengeType challengeType);
    event ChallengeJoined(uint256 indexed challengeId, address indexed user);
    event ChallengeCompleted(uint256 indexed challengeId, address indexed user, uint256 pointsEarned);
    event ChallengeProgressUpdated(uint256 indexed challengeId, address indexed user, uint256 progress);
    event MiniGameCreated(uint256 indexed gameId, string name, MiniGameType gameType);
    event GameScoreSubmitted(uint256 indexed gameId, address indexed user, uint256 score, uint256 pointsEarned);
    event LeaderboardUpdated(uint256 indexed gameId, address indexed user, uint256 rank);

    // Modifiers
    modifier challengeExists(uint256 _challengeId) {
        require(challenges[_challengeId].createdAt != 0, "Challenge does not exist");
        _;
    }

    modifier challengeActive(uint256 _challengeId) {
        require(challenges[_challengeId].status == ChallengeStatus.Active, "Challenge is not active");
        _;
    }

    modifier gameExists(uint256 _gameId) {
        require(miniGames[_gameId].createdAt != 0, "Game does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    // Challenge Management
    function createChallenge(
        string memory _title,
        string memory _description,
        ChallengeType _challengeType,
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
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_maxParticipants > 0, "Max participants must be greater than 0");
        require(_pointsReward > 0, "Points reward must be greater than 0");

        _challengeIds++;
        uint256 newChallengeId = _challengeIds;

        challenges[newChallengeId] = Challenge({
            challengeId: newChallengeId,
            title: _title,
            description: _description,
            challengeType: _challengeType,
            status: ChallengeStatus.Active,
            pointsReward: _pointsReward,
            badgeReward: _badgeReward,
            startTime: _startTime,
            endTime: _endTime,
            maxParticipants: _maxParticipants,
            currentParticipants: 0,
            requiresEvent: _requiresEvent,
            requiredEventId: _requiredEventId,
            requirements: _requirements,
            ipfsMetadata: _ipfsMetadata,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        challengesByType[_challengeType].push(newChallengeId);
        challengesByCategory[_category].push(newChallengeId);

        emit ChallengeCreated(newChallengeId, _title, _challengeType);
        return newChallengeId;
    }

    function joinChallenge(uint256 _challengeId) 
        external 
        challengeExists(_challengeId) 
        challengeActive(_challengeId) 
    {
        Challenge storage challenge = challenges[_challengeId];
        require(block.timestamp >= challenge.startTime, "Challenge has not started yet");
        require(block.timestamp <= challenge.endTime, "Challenge has ended");
        require(challenge.currentParticipants < challenge.maxParticipants, "Challenge is full");
        require(!userChallengeProgress[_challengeId][msg.sender].isParticipating, "Already participating");

        userChallengeProgress[_challengeId][msg.sender] = UserChallengeProgress({
            challengeId: _challengeId,
            user: msg.sender,
            isParticipating: true,
            isCompleted: false,
            progress: 0,
            maxProgress: challenge.requirements.length,
            completedAt: 0,
            pointsEarned: 0,
            submittedData: new string[](0)
        });

        userChallenges[msg.sender].push(_challengeId);
        challenge.currentParticipants++;

        emit ChallengeJoined(_challengeId, msg.sender);
    }

    function updateChallengeProgress(
        uint256 _challengeId,
        uint256 _progress,
        string[] memory _submittedData
    ) external challengeExists(_challengeId) {
        UserChallengeProgress storage progress = userChallengeProgress[_challengeId][msg.sender];
        require(progress.isParticipating, "Not participating in this challenge");
        require(!progress.isCompleted, "Challenge already completed");
        require(_progress <= progress.maxProgress, "Progress cannot exceed maximum");

        progress.progress = _progress;
        progress.submittedData = _submittedData;

        emit ChallengeProgressUpdated(_challengeId, msg.sender, _progress);

        // Check if challenge is completed
        if (_progress >= progress.maxProgress) {
            _completeChallenge(_challengeId, msg.sender);
        }
    }

    function completeChallenge(uint256 _challengeId) 
        external 
        challengeExists(_challengeId) 
    {
        UserChallengeProgress storage progress = userChallengeProgress[_challengeId][msg.sender];
        require(progress.isParticipating, "Not participating in this challenge");
        require(!progress.isCompleted, "Challenge already completed");
        require(progress.progress >= progress.maxProgress, "Challenge requirements not met");

        _completeChallenge(_challengeId, msg.sender);
    }

    function _completeChallenge(uint256 _challengeId, address _user) internal {
        UserChallengeProgress storage progress = userChallengeProgress[_challengeId][_user];
        Challenge storage challenge = challenges[_challengeId];

        progress.isCompleted = true;
        progress.completedAt = block.timestamp;
        progress.pointsEarned = challenge.pointsReward;

        userCompletedChallenges[_user].push(_challengeId);

        emit ChallengeCompleted(_challengeId, _user, challenge.pointsReward);
    }

    // Mini-Game Management
    function createMiniGame(
        string memory _name,
        MiniGameType _gameType,
        uint256 _pointsReward,
        uint256 _maxScore,
        string memory _gameData
    ) external onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_pointsReward > 0, "Points reward must be greater than 0");
        require(_maxScore > 0, "Max score must be greater than 0");

        _challengeIds++;
        uint256 newGameId = _challengeIds;

        miniGames[newGameId] = MiniGame({
            gameId: newGameId,
            name: _name,
            gameType: _gameType,
            pointsReward: _pointsReward,
            maxScore: _maxScore,
            isActive: true,
            gameData: _gameData,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        emit MiniGameCreated(newGameId, _name, _gameType);
        return newGameId;
    }

    function submitGameScore(
        uint256 _gameId,
        uint256 _score
    ) external gameExists(_gameId) {
        MiniGame storage game = miniGames[_gameId];
        require(game.isActive, "Game is not active");
        require(_score <= game.maxScore, "Score exceeds maximum possible score");

        uint256 pointsEarned = _calculateGamePoints(_gameId, _score);
        bool isHighScore = _score > userGameScores[_gameId][msg.sender].score;

        userGameScores[_gameId][msg.sender] = UserGameScore({
            gameId: _gameId,
            user: msg.sender,
            score: _score,
            pointsEarned: pointsEarned,
            playedAt: block.timestamp,
            isHighScore: isHighScore
        });

        if (userPlayedGames[msg.sender].length == 0 || 
            userPlayedGames[msg.sender][userPlayedGames[msg.sender].length - 1] != _gameId) {
            userPlayedGames[msg.sender].push(_gameId);
        }

        _updateGameLeaderboard(_gameId, msg.sender, _score);

        emit GameScoreSubmitted(_gameId, msg.sender, _score, pointsEarned);
    }

    function _updateGameLeaderboard(uint256 _gameId, address _user, uint256 _score) internal {
        address[] storage leaderboard = gameLeaderboard[_gameId];
        
        // Remove user from current position if exists
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == _user) {
                leaderboard[i] = leaderboard[leaderboard.length - 1];
                leaderboard.pop();
                break;
            }
        }

        // Insert user in correct position
        bool inserted = false;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (_score > userGameScores[_gameId][leaderboard[i]].score) {
                // Insert at position i
                leaderboard.push(leaderboard[leaderboard.length - 1]);
                for (uint256 j = leaderboard.length - 1; j > i; j--) {
                    leaderboard[j] = leaderboard[j - 1];
                }
                leaderboard[i] = _user;
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            leaderboard.push(_user);
        }

        // Limit leaderboard to top 100
        if (leaderboard.length > 100) {
            leaderboard.pop();
        }

        // Find user's rank
        uint256 rank = 0;
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == _user) {
                rank = i + 1;
                break;
            }
        }

        emit LeaderboardUpdated(_gameId, _user, rank);
    }

    function _calculateGamePoints(uint256 _gameId, uint256 _score) internal view returns (uint256) {
        MiniGame storage game = miniGames[_gameId];
        
        // Calculate points based on score percentage
        uint256 scorePercentage = (_score * 100) / game.maxScore;
        
        if (scorePercentage >= 90) return game.pointsReward;
        if (scorePercentage >= 80) return (game.pointsReward * 80) / 100;
        if (scorePercentage >= 70) return (game.pointsReward * 60) / 100;
        if (scorePercentage >= 60) return (game.pointsReward * 40) / 100;
        if (scorePercentage >= 50) return (game.pointsReward * 20) / 100;
        
        return 0;
    }

    // Admin functions
    function updateChallengeStatus(uint256 _challengeId, ChallengeStatus _newStatus) 
        external 
        onlyOwner 
        challengeExists(_challengeId) 
    {
        challenges[_challengeId].status = _newStatus;
    }

    function updateMiniGameStatus(uint256 _gameId, bool _isActive) 
        external 
        onlyOwner 
        gameExists(_gameId) 
    {
        miniGames[_gameId].isActive = _isActive;
    }

    // View functions
    function getChallenge(uint256 _challengeId) external view challengeExists(_challengeId) returns (Challenge memory) {
        return challenges[_challengeId];
    }

    function getUserChallengeProgress(uint256 _challengeId, address _user) 
        external 
        view 
        challengeExists(_challengeId) 
        returns (UserChallengeProgress memory) 
    {
        return userChallengeProgress[_challengeId][_user];
    }

    function getUserChallenges(address _user) external view returns (uint256[] memory) {
        return userChallenges[_user];
    }

    function getUserCompletedChallenges(address _user) external view returns (uint256[] memory) {
        return userCompletedChallenges[_user];
    }

    function getChallengesByType(ChallengeType _challengeType) external view returns (uint256[] memory) {
        return challengesByType[_challengeType];
    }

    function getChallengesByCategory(string memory _category) external view returns (uint256[] memory) {
        return challengesByCategory[_category];
    }

    function getMiniGame(uint256 _gameId) external view gameExists(_gameId) returns (MiniGame memory) {
        return miniGames[_gameId];
    }

    function getUserGameScore(uint256 _gameId, address _user) 
        external 
        view 
        gameExists(_gameId) 
        returns (UserGameScore memory) 
    {
        return userGameScores[_gameId][_user];
    }

    function getGameLeaderboard(uint256 _gameId) external view gameExists(_gameId) returns (address[] memory) {
        return gameLeaderboard[_gameId];
    }

    function getUserPlayedGames(address _user) external view returns (uint256[] memory) {
        return userPlayedGames[_user];
    }

    function getTopScores(uint256 _gameId, uint256 _limit) 
        external 
        view 
        gameExists(_gameId) 
        returns (address[] memory users, uint256[] memory scores) 
    {
        address[] storage leaderboard = gameLeaderboard[_gameId];
        uint256 length = leaderboard.length < _limit ? leaderboard.length : _limit;
        
        users = new address[](length);
        scores = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            users[i] = leaderboard[i];
            scores[i] = userGameScores[_gameId][leaderboard[i]].score;
        }
    }

    function getUserRank(uint256 _gameId, address _user) 
        external 
        view 
        gameExists(_gameId) 
        returns (uint256 rank) 
    {
        address[] storage leaderboard = gameLeaderboard[_gameId];
        
        for (uint256 i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i] == _user) {
                return i + 1;
            }
        }
        
        return 0; // User not in leaderboard
    }
}
