const EventModel = require('../models/Event');
const UserModel = require('../models/User');
const { validateEvent } = require('../utils/validation');
const { handleAsync } = require('../utils/errorHandler');

class EventController {
  // Create new event
  static createEvent = handleAsync(async (req, res) => {
    const { error, value } = validateEvent(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message),
      });
    }

    // Find host user
    const host = await UserModel.findByWalletAddress(value.hostWalletAddress);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: 'Host user not found',
      });
    }

    const eventData = {
      ...value,
      hostId: host.id,
    };

    const event = await EventModel.create(eventData);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  });

  // Get event by ID
  static getEvent = handleAsync(async (req, res) => {
    const { eventId } = req.params;
    
    const event = await EventModel.getEventWithMetadata(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  });

  // Get events with filters and pagination
  static getEvents = handleAsync(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      status,
      hostWalletAddress,
      interests,
      location,
      upcoming = false,
    } = req.query;

    const filters = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      location,
      upcoming: upcoming === 'true',
    };

    if (hostWalletAddress) {
      const host = await UserModel.findByWalletAddress(hostWalletAddress);
      if (host) {
        filters.hostId = host.id;
      }
    }

    if (interests) {
      filters.interests = interests.split(',').map(i => i.trim());
    }

    const result = await EventModel.getEvents(filters);
    
    res.json({
      success: true,
      data: result,
    });
  });

  // Register for event
  static registerForEvent = handleAsync(async (req, res) => {
    const { eventId } = req.params;
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required',
      });
    }

    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const attendance = await EventModel.registerUser(eventId, user.id);
    
    // Emit socket event to notify event host
    const io = req.app.get('io');
    io.to(attendance.event.host?.walletAddress).emit('event_registration', {
      event: attendance.event,
      user: attendance.user,
    });

    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: attendance,
    });
  });

  // Check in to event
  static checkInToEvent = handleAsync(async (req, res) => {
    const { eventId } = req.params;
    const { walletAddress, qrCodeHash } = req.body;

    if (!walletAddress || !qrCodeHash) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address and QR code hash are required',
      });
    }

    const user = await UserModel.findByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const attendance = await EventModel.checkInUser(eventId, user.id, qrCodeHash);
    
    // Emit socket event to notify event host
    const io = req.app.get('io');
    io.to(attendance.event.host?.walletAddress).emit('event_checkin', {
      event: attendance.event,
      user: attendance.user,
      checkedInAt: attendance.checkedInAt,
    });

    res.json({
      success: true,
      message: 'Successfully checked in to event',
      data: attendance,
    });
  });

  // Get event attendees
  static getEventAttendees = handleAsync(async (req, res) => {
    const { eventId } = req.params;
    
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const attendees = event.attendances.map(attendance => ({
      ...attendance.user,
      registeredAt: attendance.registeredAt,
      checkedIn: attendance.checkedIn,
      checkedInAt: attendance.checkedInAt,
    }));

    res.json({
      success: true,
      data: {
        eventId,
        totalAttendees: attendees.length,
        maxAttendees: event.maxAttendees,
        attendees,
      },
    });
  });

  // Update event status
  static updateEventStatus = handleAsync(async (req, res) => {
    const { eventId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const event = await EventModel.updateStatus(eventId, status);
    
    // Notify all attendees about status change
    const fullEvent = await EventModel.findById(eventId);
    const io = req.app.get('io');
    
    fullEvent.attendances.forEach(attendance => {
      io.to(attendance.user.walletAddress).emit('event_status_updated', {
        eventId,
        eventTitle: fullEvent.title,
        status,
      });
    });

    res.json({
      success: true,
      message: 'Event status updated successfully',
      data: event,
    });
  });

  // Get event statistics
  static getEventStats = handleAsync(async (req, res) => {
    const { eventId } = req.params;
    
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const stats = {
      eventId,
      title: event.title,
      status: event.status,
      totalRegistrations: event.attendances.length,
      totalCheckedIn: event.attendances.filter(a => a.checkedIn).length,
      maxAttendees: event.maxAttendees,
      registrationRate: event.maxAttendees > 0 ? (event.attendances.length / event.maxAttendees * 100).toFixed(2) : 0,
      checkInRate: event.attendances.length > 0 ? (event.attendances.filter(a => a.checkedIn).length / event.attendances.length * 100).toFixed(2) : 0,
      upcomingSlots: Math.max(0, event.maxAttendees - event.attendances.length),
    };

    res.json({
      success: true,
      data: stats,
    });
  });

  // Get upcoming events
  static getUpcomingEvents = handleAsync(async (req, res) => {
    const { limit = 10, interests } = req.query;

    const filters = {
      upcoming: true,
      limit: parseInt(limit),
    };

    if (interests) {
      filters.interests = interests.split(',').map(i => i.trim());
    }

    const result = await EventModel.getEvents(filters);
    
    res.json({
      success: true,
      data: result.events,
    });
  });

  // Search events
  static searchEvents = handleAsync(async (req, res) => {
    const { 
      query, 
      location, 
      interests, 
      startDate, 
      endDate,
      limit = 20 
    } = req.query;

    if (!query && !location && !interests) {
      return res.status(400).json({
        success: false,
        message: 'At least one search parameter is required',
      });
    }

    // This is a simplified search - in production, you might want to use
    // a proper search engine like Elasticsearch
    const prisma = require('../config/database');
    const where = {
      AND: [],
    };

    if (query) {
      where.AND.push({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      });
    }

    if (location) {
      where.AND.push({
        location: { contains: location, mode: 'insensitive' },
      });
    }

    if (interests) {
      const interestArray = interests.split(',').map(i => i.trim());
      where.AND.push({
        targetInterests: {
          path: '$',
          array_contains: interestArray,
        },
      });
    }

    if (startDate) {
      where.AND.push({
        startTime: { gte: new Date(startDate) },
      });
    }

    if (endDate) {
      where.AND.push({
        endTime: { lte: new Date(endDate) },
      });
    }

    const events = await prisma.event.findMany({
      where: where.AND.length > 0 ? where : {},
      include: {
        host: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            profileImageUrl: true,
          },
        },
        attendances: {
          select: {
            id: true,
            userId: true,
            checkedIn: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
      take: parseInt(limit),
    });

    res.json({
      success: true,
      data: events,
    });
  });
}

module.exports = EventController;