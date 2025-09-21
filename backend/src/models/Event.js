const prisma = require('../config/database');
const { uploadEventData, getFromIPFS } = require('../services/ipfsService');
const { createEvent } = require('../services/blockchainService');

class EventModel {
  // Create a new event
  static async create(eventData) {
    try {
      // First upload event metadata to IPFS
      const ipfsResult = await uploadEventData(eventData);
      
      // Create event in database
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          ipfsHash: ipfsResult.hash,
          hostId: eventData.hostId,
          startTime: new Date(eventData.startTime),
          endTime: new Date(eventData.endTime),
          maxAttendees: eventData.maxAttendees,
          registrationFee: BigInt(eventData.registrationFee || 0),
          eventType: eventData.eventType || 0,
          pointsReward: eventData.pointsReward || 0,
          requiresApproval: eventData.requiresApproval || false,
          targetInterests: eventData.targetInterests || [],
        },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
              profileImageUrl: true,
            },
          },
        },
      });

      // Create event on blockchain
      try {
        const blockchainData = {
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          ipfsMetadata: ipfsResult.hash,
          startTime: Math.floor(new Date(eventData.startTime).getTime() / 1000),
          endTime: Math.floor(new Date(eventData.endTime).getTime() / 1000),
          maxAttendees: eventData.maxAttendees,
          registrationFee: BigInt(eventData.registrationFee || 0),
          eventType: eventData.eventType || 0,
          targetInterests: eventData.targetInterests || [],
          pointsReward: eventData.pointsReward || 0,
          requiresApproval: eventData.requiresApproval || false,
        };

        const blockchainResult = await createEvent(blockchainData);
        
        // Update event with blockchain details
        await prisma.event.update({
          where: { id: event.id },
          data: {
            eventId: BigInt(blockchainResult.eventId || 0),
            txHash: blockchainResult.txHash,
            blockNumber: BigInt(blockchainResult.blockNumber || 0),
          },
        });
      } catch (blockchainError) {
        console.warn('Blockchain event creation failed, event stored off-chain only:', blockchainError.message);
      }

      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Find event by ID
  static async findById(eventId) {
    try {
      return await prisma.event.findUnique({
        where: { id: eventId },
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
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  walletAddress: true,
                  profileImageUrl: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Error finding event by ID:', error);
      throw error;
    }
  }

  // Get events with pagination and filters
  static async getEvents({
    page = 1,
    limit = 10,
    status = null,
    hostId = null,
    interests = [],
    location = null,
    upcoming = false,
  } = {}) {
    try {
      const skip = (page - 1) * limit;
      const where = {};

      if (status) {
        where.status = status;
      }

      if (hostId) {
        where.hostId = hostId;
      }

      if (location) {
        where.location = {
          contains: location,
          mode: 'insensitive',
        };
      }

      if (upcoming) {
        where.startTime = {
          gte: new Date(),
        };
      }

      if (interests.length > 0) {
        where.targetInterests = {
          path: '$',
          array_contains: interests,
        };
      }

      const [events, totalCount] = await Promise.all([
        prisma.event.findMany({
          where,
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
          skip,
          take: limit,
        }),
        prisma.event.count({ where }),
      ]);

      return {
        events,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error getting events:', error);
      throw error;
    }
  }

  // Register user for event
  static async registerUser(eventId, userId) {
    try {
      const event = await this.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Check if event is full
      if (event.attendances.length >= event.maxAttendees) {
        throw new Error('Event is full');
      }

      // Check if user is already registered
      const existingAttendance = await prisma.eventAttendance.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (existingAttendance) {
        throw new Error('User already registered for this event');
      }

      // Create attendance record
      const attendance = await prisma.eventAttendance.create({
        data: {
          userId,
          eventId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
              profileImageUrl: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              startTime: true,
              location: true,
            },
          },
        },
      });

      return attendance;
    } catch (error) {
      console.error('Error registering user for event:', error);
      throw error;
    }
  }

  // Check user into event
  static async checkInUser(eventId, userId, qrCodeHash) {
    try {
      const attendance = await prisma.eventAttendance.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
        include: {
          event: true,
          user: true,
        },
      });

      if (!attendance) {
        throw new Error('User not registered for this event');
      }

      if (attendance.checkedIn) {
        throw new Error('User already checked in');
      }

      // Verify QR code hash (implement your verification logic here)
      // For now, we'll accept any non-empty hash
      if (!qrCodeHash) {
        throw new Error('Invalid QR code');
      }

      // Update attendance record
      const updatedAttendance = await prisma.eventAttendance.update({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
        data: {
          checkedIn: true,
          checkedInAt: new Date(),
          qrCodeHash,
        },
        include: {
          user: true,
          event: true,
        },
      });

      // Award points to user for attending
      if (attendance.event.pointsReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalPoints: {
              increment: attendance.event.pointsReward,
            },
          },
        });
      }

      return updatedAttendance;
    } catch (error) {
      console.error('Error checking in user:', error);
      throw error;
    }
  }

  // Get event with IPFS metadata
  static async getEventWithMetadata(eventId) {
    try {
      const event = await this.findById(eventId);
      if (!event) {
        return null;
      }

      // If event has IPFS hash, fetch metadata
      let ipfsMetadata = null;
      if (event.ipfsHash) {
        try {
          ipfsMetadata = await getFromIPFS(event.ipfsHash);
        } catch (ipfsError) {
          console.warn('Failed to fetch IPFS metadata:', ipfsError.message);
        }
      }

      return {
        ...event,
        metadata: ipfsMetadata,
      };
    } catch (error) {
      console.error('Error getting event with metadata:', error);
      throw error;
    }
  }

  // Update event status
  static async updateStatus(eventId, status) {
    try {
      return await prisma.event.update({
        where: { id: eventId },
        data: { status },
      });
    } catch (error) {
      console.error('Error updating event status:', error);
      throw error;
    }
  }

  // Get user's events (hosted and attending)
  static async getUserEvents(userId) {
    try {
      const [hostedEvents, attendingEvents] = await Promise.all([
        prisma.event.findMany({
          where: { hostId: userId },
          include: {
            attendances: {
              select: {
                id: true,
                userId: true,
                checkedIn: true,
              },
            },
          },
          orderBy: { startTime: 'desc' },
        }),
        prisma.eventAttendance.findMany({
          where: { userId },
          include: {
            event: {
              include: {
                host: {
                  select: {
                    id: true,
                    name: true,
                    walletAddress: true,
                    profileImageUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { registeredAt: 'desc' },
        }),
      ]);

      return {
        hosted: hostedEvents,
        attending: attendingEvents.map(a => a.event),
      };
    } catch (error) {
      console.error('Error getting user events:', error);
      throw error;
    }
  }
}

module.exports = EventModel;