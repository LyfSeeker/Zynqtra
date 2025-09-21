const express = require('express');
const EventController = require('../controllers/EventController');

const router = express.Router();

// Event CRUD operations
router.post('/', EventController.createEvent);
router.get('/', EventController.getEvents);
router.get('/upcoming', EventController.getUpcomingEvents);
router.get('/search', EventController.searchEvents);
router.get('/:eventId', EventController.getEvent);

// Event participation
router.post('/:eventId/register', EventController.registerForEvent);
router.post('/:eventId/checkin', EventController.checkInToEvent);
router.get('/:eventId/attendees', EventController.getEventAttendees);

// Event management
router.put('/:eventId/status', EventController.updateEventStatus);
router.get('/:eventId/stats', EventController.getEventStats);

module.exports = router;