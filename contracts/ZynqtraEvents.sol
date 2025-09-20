// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ZynqtraEvents is Ownable, ReentrancyGuard {
    uint256 private _eventIds;

    enum EventStatus {
        Draft,
        Active,
        InProgress,
        Completed,
        Cancelled
    }

    enum EventType {
        Networking,
        Workshop,
        Conference,
        Meetup,
        Hackathon,
        Social
    }

    struct Event {
        uint256 eventId;
        string title;
        string description;
        string location;
        string ipfsMetadata;
        address host;
        uint256 startTime;
        uint256 endTime;
        uint256 maxAttendees;
        uint256 currentAttendees;
        uint256 registrationFee;
        EventStatus status;
        EventType eventType;
        string[] targetInterests;
        uint256 pointsReward;
        bool requiresApproval;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct EventRegistration {
        uint256 eventId;
        address participant;
        uint256 timestamp;
        bool attended;
        bool checkedIn;
        uint256 pointsEarned;
        string qrCodeHash;
        bool isApproved;
    }

    struct EventChallenge {
        uint256 challengeId;
        string title;
        string description;
        uint256 pointsReward;
        bool isCompleted;
        uint256 completedAt;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => mapping(address => EventRegistration)) public registrations;
    mapping(uint256 => address[]) public eventParticipants;
    mapping(uint256 => address[]) public approvedParticipants;
    mapping(address => uint256[]) public userEvents;
    mapping(address => uint256[]) public userHostedEvents;
    mapping(uint256 => EventChallenge[]) public eventChallenges;
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public challengeCompletions;
    
    // QR Code verification
    mapping(string => bool) public usedQRCodes;
    mapping(string => address) public qrCodeToUser;

    // Events
    event EventCreated(uint256 indexed eventId, address indexed host, string title);
    event EventUpdated(uint256 indexed eventId, string title);
    event EventRegistered(uint256 indexed eventId, address indexed participant);
    event RegistrationApproved(uint256 indexed eventId, address indexed participant);
    event RegistrationRejected(uint256 indexed eventId, address indexed participant);
    event AttendanceMarked(uint256 indexed eventId, address indexed participant, uint256 points);
    event CheckInCompleted(uint256 indexed eventId, address indexed participant, string qrCodeHash);
    event ChallengeCompleted(uint256 indexed eventId, address indexed participant, uint256 challengeId, uint256 points);
    event EventStatusChanged(uint256 indexed eventId, EventStatus newStatus);

    // Modifiers
    modifier onlyEventHost(uint256 _eventId) {
        require(events[_eventId].host == msg.sender, "Only event host can perform this action");
        _;
    }

    modifier eventExists(uint256 _eventId) {
        require(events[_eventId].eventId != 0, "Event does not exist");
        _;
    }

    modifier validEventStatus(uint256 _eventId, EventStatus _requiredStatus) {
        require(events[_eventId].status == _requiredStatus, "Invalid event status");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createEvent(
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _ipfsMetadata,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxAttendees,
        uint256 _registrationFee,
        EventType _eventType,
        string[] memory _targetInterests,
        uint256 _pointsReward,
        bool _requiresApproval
    ) external returns (uint256) {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_maxAttendees > 0, "Max attendees must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_targetInterests.length > 0, "Must have at least one target interest");

        _eventIds++;
        uint256 newEventId = _eventIds;

        events[newEventId] = Event({
            eventId: newEventId,
            title: _title,
            description: _description,
            location: _location,
            ipfsMetadata: _ipfsMetadata,
            host: msg.sender,
            startTime: _startTime,
            endTime: _endTime,
            maxAttendees: _maxAttendees,
            currentAttendees: 0,
            registrationFee: _registrationFee,
            status: EventStatus.Active,
            eventType: _eventType,
            targetInterests: _targetInterests,
            pointsReward: _pointsReward,
            requiresApproval: _requiresApproval,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        userHostedEvents[msg.sender].push(newEventId);

        emit EventCreated(newEventId, msg.sender, _title);
        return newEventId;
    }

    function registerForEvent(uint256 _eventId) external payable eventExists(_eventId) nonReentrant {
        Event storage eventData = events[_eventId];
        require(eventData.status == EventStatus.Active, "Event is not accepting registrations");
        require(block.timestamp < eventData.startTime, "Registration period has ended");
        require(eventData.currentAttendees < eventData.maxAttendees, "Event is full");
        require(registrations[_eventId][msg.sender].participant == address(0), "Already registered");
        require(msg.value >= eventData.registrationFee, "Insufficient registration fee");

        registrations[_eventId][msg.sender] = EventRegistration({
            eventId: _eventId,
            participant: msg.sender,
            timestamp: block.timestamp,
            attended: false,
            checkedIn: false,
            pointsEarned: 0,
            qrCodeHash: "",
            isApproved: !eventData.requiresApproval
        });

        eventParticipants[_eventId].push(msg.sender);
        userEvents[msg.sender].push(_eventId);

        if (!eventData.requiresApproval) {
            eventData.currentAttendees++;
            approvedParticipants[_eventId].push(msg.sender);
        }

        // Refund excess payment
        if (msg.value > eventData.registrationFee) {
            payable(msg.sender).transfer(msg.value - eventData.registrationFee);
        }

        emit EventRegistered(_eventId, msg.sender);
    }

    function approveRegistration(uint256 _eventId, address _participant) 
        external 
        onlyEventHost(_eventId) 
        eventExists(_eventId) 
    {
        EventRegistration storage registration = registrations[_eventId][_participant];
        require(registration.participant != address(0), "Registration does not exist");
        require(!registration.isApproved, "Registration already approved");
        require(events[_eventId].currentAttendees < events[_eventId].maxAttendees, "Event is full");

        registration.isApproved = true;
        events[_eventId].currentAttendees++;
        approvedParticipants[_eventId].push(_participant);

        emit RegistrationApproved(_eventId, _participant);
    }

    function rejectRegistration(uint256 _eventId, address _participant) 
        external 
        onlyEventHost(_eventId) 
        eventExists(_eventId) 
    {
        EventRegistration storage registration = registrations[_eventId][_participant];
        require(registration.participant != address(0), "Registration does not exist");
        require(!registration.isApproved, "Registration already approved");

        // Remove from participants list
        _removeFromParticipantsList(_eventId, _participant);
        _removeFromUserEvents(_participant, _eventId);

        // Refund registration fee
        if (events[_eventId].registrationFee > 0) {
            payable(_participant).transfer(events[_eventId].registrationFee);
        }

        delete registrations[_eventId][_participant];

        emit RegistrationRejected(_eventId, _participant);
    }

    function checkIn(uint256 _eventId, string memory _qrCodeHash) 
        external 
        eventExists(_eventId) 
    {
        EventRegistration storage registration = registrations[_eventId][msg.sender];
        require(registration.participant != address(0), "Not registered for this event");
        require(registration.isApproved, "Registration not approved");
        require(!registration.checkedIn, "Already checked in");
        require(!usedQRCodes[_qrCodeHash], "QR code already used");
        require(block.timestamp >= events[_eventId].startTime, "Event has not started yet");
        require(block.timestamp <= events[_eventId].endTime, "Event has ended");

        registration.checkedIn = true;
        registration.qrCodeHash = _qrCodeHash;
        usedQRCodes[_qrCodeHash] = true;
        qrCodeToUser[_qrCodeHash] = msg.sender;

        emit CheckInCompleted(_eventId, msg.sender, _qrCodeHash);
    }

    function markAttendance(uint256 _eventId, address _participant, uint256 _points) 
        external 
        onlyEventHost(_eventId) 
        eventExists(_eventId) 
    {
        EventRegistration storage registration = registrations[_eventId][_participant];
        require(registration.participant != address(0), "Not registered");
        require(registration.isApproved, "Registration not approved");
        require(registration.checkedIn, "Must check in first");
        require(!registration.attended, "Already marked attended");

        registration.attended = true;
        registration.pointsEarned = _points;

        emit AttendanceMarked(_eventId, _participant, _points);
    }

    function addEventChallenge(
        uint256 _eventId,
        string memory _title,
        string memory _description,
        uint256 _pointsReward
    ) external onlyEventHost(_eventId) eventExists(_eventId) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_pointsReward > 0, "Points reward must be greater than 0");

        uint256 challengeId = eventChallenges[_eventId].length;
        eventChallenges[_eventId].push(EventChallenge({
            challengeId: challengeId,
            title: _title,
            description: _description,
            pointsReward: _pointsReward,
            isCompleted: false,
            completedAt: 0
        }));
    }

    function completeChallenge(uint256 _eventId, uint256 _challengeId) 
        external 
        eventExists(_eventId) 
    {
        require(_challengeId < eventChallenges[_eventId].length, "Challenge does not exist");
        require(!challengeCompletions[_eventId][msg.sender][_challengeId], "Challenge already completed");
        require(registrations[_eventId][msg.sender].checkedIn, "Must be checked in to complete challenges");

        EventChallenge storage challenge = eventChallenges[_eventId][_challengeId];
        challenge.isCompleted = true;
        challenge.completedAt = block.timestamp;
        challengeCompletions[_eventId][msg.sender][_challengeId] = true;

        // Award points
        registrations[_eventId][msg.sender].pointsEarned += challenge.pointsReward;

        emit ChallengeCompleted(_eventId, msg.sender, _challengeId, challenge.pointsReward);
    }

    function updateEventStatus(uint256 _eventId, EventStatus _newStatus) 
        external 
        onlyEventHost(_eventId) 
        eventExists(_eventId) 
    {
        require(_newStatus != EventStatus.Draft, "Cannot set status to draft");
        events[_eventId].status = _newStatus;
        events[_eventId].updatedAt = block.timestamp;

        emit EventStatusChanged(_eventId, _newStatus);
    }

    function updateEvent(
        uint256 _eventId,
        string memory _title,
        string memory _description,
        string memory _location,
        string memory _ipfsMetadata,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxAttendees,
        uint256 _registrationFee,
        string[] memory _targetInterests,
        uint256 _pointsReward
    ) external onlyEventHost(_eventId) eventExists(_eventId) {
        require(events[_eventId].status == EventStatus.Draft || events[_eventId].status == EventStatus.Active, 
                "Cannot update event in current status");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_maxAttendees >= events[_eventId].currentAttendees, "Max attendees cannot be less than current attendees");

        Event storage eventData = events[_eventId];
        eventData.title = _title;
        eventData.description = _description;
        eventData.location = _location;
        eventData.ipfsMetadata = _ipfsMetadata;
        eventData.startTime = _startTime;
        eventData.endTime = _endTime;
        eventData.maxAttendees = _maxAttendees;
        eventData.registrationFee = _registrationFee;
        eventData.targetInterests = _targetInterests;
        eventData.pointsReward = _pointsReward;
        eventData.updatedAt = block.timestamp;

        emit EventUpdated(_eventId, _title);
    }

    // View functions
    function getEvent(uint256 _eventId) external view eventExists(_eventId) returns (Event memory) {
        return events[_eventId];
    }

    function getEventParticipants(uint256 _eventId) external view eventExists(_eventId) returns (address[] memory) {
        return eventParticipants[_eventId];
    }

    function getApprovedParticipants(uint256 _eventId) external view eventExists(_eventId) returns (address[] memory) {
        return approvedParticipants[_eventId];
    }

    function getUserEvents(address _user) external view returns (uint256[] memory) {
        return userEvents[_user];
    }

    function getUserHostedEvents(address _user) external view returns (uint256[] memory) {
        return userHostedEvents[_user];
    }

    function getRegistration(uint256 _eventId, address _participant) 
        external 
        view 
        eventExists(_eventId) 
        returns (EventRegistration memory) 
    {
        return registrations[_eventId][_participant];
    }

    function getEventChallenges(uint256 _eventId) external view eventExists(_eventId) returns (EventChallenge[] memory) {
        return eventChallenges[_eventId];
    }

    function getUserChallengeProgress(uint256 _eventId, address _user) 
        external 
        view 
        eventExists(_eventId) 
        returns (bool[] memory) 
    {
        EventChallenge[] memory challenges = eventChallenges[_eventId];
        bool[] memory progress = new bool[](challenges.length);
        
        for (uint256 i = 0; i < challenges.length; i++) {
            progress[i] = challengeCompletions[_eventId][_user][i];
        }
        
        return progress;
    }

    function isQRCodeUsed(string memory _qrCodeHash) external view returns (bool) {
        return usedQRCodes[_qrCodeHash];
    }

    function getQRCodeUser(string memory _qrCodeHash) external view returns (address) {
        return qrCodeToUser[_qrCodeHash];
    }

    // Internal functions
    function _removeFromParticipantsList(uint256 _eventId, address _participant) internal {
        address[] storage participants = eventParticipants[_eventId];
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == _participant) {
                participants[i] = participants[participants.length - 1];
                participants.pop();
                break;
            }
        }
    }

    function _removeFromUserEvents(address _user, uint256 _eventId) internal {
        uint256[] storage userEventList = userEvents[_user];
        for (uint256 i = 0; i < userEventList.length; i++) {
            if (userEventList[i] == _eventId) {
                userEventList[i] = userEventList[userEventList.length - 1];
                userEventList.pop();
                break;
            }
        }
    }

    // Withdraw function for event hosts
    function withdrawEventFees(uint256 _eventId) external onlyEventHost(_eventId) eventExists(_eventId) {
        require(events[_eventId].status == EventStatus.Completed, "Event must be completed to withdraw fees");
        
        uint256 totalFees = events[_eventId].registrationFee * events[_eventId].currentAttendees;
        require(totalFees > 0, "No fees to withdraw");
        
        payable(msg.sender).transfer(totalFees);
    }
}
