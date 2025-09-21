const prisma = require('../config/database');
const { uploadUserProfile, getFromIPFS } = require('../services/ipfsService');
const { createUserProfile, updateUserProfile } = require('../services/blockchainService');

class UserModel {
  // Create a new user profile
  static async create(userData) {
    try {
      // First upload profile data to IPFS
      const ipfsResult = await uploadUserProfile(userData);
      
      // Create user in database
      const user = await prisma.user.create({
        data: {
          walletAddress: userData.walletAddress.toLowerCase(),
          name: userData.name,
          email: userData.email,
          bio: userData.bio,
          ipfsHash: ipfsResult.hash,
          interests: userData.interests || [],
          skills: userData.skills || [],
          location: userData.location,
          linkedinUsername: userData.linkedinUsername,
          twitterUsername: userData.twitterUsername,
          githubUsername: userData.githubUsername,
          profileImageUrl: userData.profileImageUrl,
        },
      });

      // Create profile on blockchain
      try {
        const blockchainResult = await createUserProfile({
          name: userData.name,
          email: userData.email,
          interests: userData.interests || [],
          ipfsHash: ipfsResult.hash,
        });

        // Update user with blockchain details
        await prisma.user.update({
          where: { id: user.id },
          data: {
            profileTokenId: BigInt(blockchainResult.tokenId || 0),
          },
        });
      } catch (blockchainError) {
        console.warn('Blockchain profile creation failed, profile stored off-chain only:', blockchainError.message);
      }

      return user;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Find user by wallet address
  static async findByWalletAddress(walletAddress) {
    try {
      return await prisma.user.findUnique({
        where: { 
          walletAddress: walletAddress.toLowerCase() 
        },
        include: {
          userBadges: {
            include: {
              badge: true,
            },
          },
          hostedEvents: {
            include: {
              attendances: true,
            },
          },
          connections: {
            include: {
              fromUser: {
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
      console.error('Error finding user by wallet address:', error);
      throw error;
    }
  }

  // Update user profile
  static async update(walletAddress, updateData) {
    try {
      const user = await this.findByWalletAddress(walletAddress);
      if (!user) {
        throw new Error('User not found');
      }

      // Upload updated profile to IPFS
      const combinedData = {
        ...user,
        ...updateData,
      };
      const ipfsResult = await uploadUserProfile(combinedData);

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { walletAddress: walletAddress.toLowerCase() },
        data: {
          ...updateData,
          ipfsHash: ipfsResult.hash,
        },
      });

      // Update profile on blockchain if it exists
      if (user.profileTokenId) {
        try {
          await updateUserProfile(walletAddress, ipfsResult.hash);
        } catch (blockchainError) {
          console.warn('Blockchain profile update failed:', blockchainError.message);
        }
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user profile with IPFS data
  static async getProfileWithMetadata(walletAddress) {
    try {
      const user = await this.findByWalletAddress(walletAddress);
      if (!user) {
        return null;
      }

      // If user has IPFS hash, fetch metadata
      let ipfsMetadata = null;
      if (user.ipfsHash) {
        try {
          ipfsMetadata = await getFromIPFS(user.ipfsHash);
        } catch (ipfsError) {
          console.warn('Failed to fetch IPFS metadata:', ipfsError.message);
        }
      }

      return {
        ...user,
        metadata: ipfsMetadata,
      };
    } catch (error) {
      console.error('Error getting user profile with metadata:', error);
      throw error;
    }
  }

  // Award points to user
  static async awardPoints(walletAddress, points, source) {
    try {
      const user = await prisma.user.update({
        where: { walletAddress: walletAddress.toLowerCase() },
        data: {
          totalPoints: {
            increment: points,
          },
        },
      });

      // Calculate new level (simple formula: level = floor(totalPoints / 1000) + 1)
      const newLevel = Math.floor(user.totalPoints / 1000) + 1;
      
      if (newLevel > user.level) {
        await prisma.user.update({
          where: { walletAddress: walletAddress.toLowerCase() },
          data: { level: newLevel },
        });
      }

      return user;
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Search users by interests or skills
  static async searchByInterests(interests, skills = []) {
    try {
      const searchTerms = [...interests, ...skills];
      
      // Using PostgreSQL JSON operators for array intersection
      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              interests: {
                path: '$',
                array_contains: searchTerms,
              },
            },
            {
              skills: {
                path: '$',
                array_contains: searchTerms,
              },
            },
          ],
        },
        select: {
          id: true,
          walletAddress: true,
          name: true,
          bio: true,
          interests: true,
          skills: true,
          profileImageUrl: true,
          totalPoints: true,
          level: true,
        },
        take: 20,
      });

      return users;
    } catch (error) {
      console.error('Error searching users by interests:', error);
      throw error;
    }
  }

  // Get leaderboard
  static async getLeaderboard(limit = 10) {
    try {
      return await prisma.user.findMany({
        orderBy: {
          totalPoints: 'desc',
        },
        select: {
          walletAddress: true,
          name: true,
          profileImageUrl: true,
          totalPoints: true,
          level: true,
        },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

module.exports = UserModel;