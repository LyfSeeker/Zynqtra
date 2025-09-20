// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ZynqtraEvents is Ownable {
    struct EventRegistration {
        uint256 eventId;
        address participant;
        uint256 timestamp;
        bool attended;
        uint256 pointsEarned;
    }

    mapping(uint256 => mapping(address => EventRegistration)) public registrations;
    mapping(uint256 => address[]) public eventParticipants;
    mapping(address => uint256[]) public userEvents;
    mapping(uint256 => bool) public eventExists;

    event EventRegistered(uint256 indexed eventId, address indexed participant);
    event AttendanceMarked(uint256 indexed eventId, address indexed participant, uint256 points);

    function registerForEvent(uint256 _eventId) external {
        require(eventExists[_eventId], "Event does not exist");
        require(registrations[_eventId][msg.sender].participant == address(0), "Already registered");
        
        registrations[_eventId][msg.sender] = EventRegistration({
            eventId: _eventId,
            participant: msg.sender,
            timestamp: block.timestamp,
            attended: false,
            pointsEarned: 0
        });
        
        eventParticipants[_eventId].push(msg.sender);
        userEvents[msg.sender].push(_eventId);
        
        emit EventRegistered(_eventId, msg.sender);
    }

    function markAttendance(uint256 _eventId, address _participant, uint256 _points) external onlyOwner {
        require(registrations[_eventId][_participant].participant != address(0), "Not registered");
        require(!registrations[_eventId][_participant].attended, "Already marked attended");
        
        registrations[_eventId][_participant].attended = true;
        registrations[_eventId][_participant].pointsEarned = _points;
        
        emit AttendanceMarked(_eventId, _participant, _points);
    }

    function createEvent(uint256 _eventId) external onlyOwner {
        require(!eventExists[_eventId], "Event already exists");
        eventExists[_eventId] = true;
    }

    function getEventParticipants(uint256 _eventId) external view returns (address[] memory) {
        return eventParticipants[_eventId];
    }

    function getUserEvents(address _user) external view returns (uint256[] memory) {
        return userEvents[_user];
    }

    function getRegistration(uint256 _eventId, address _participant) external view returns (EventRegistration memory) {
        return registrations[_eventId][_participant];
    }
}
