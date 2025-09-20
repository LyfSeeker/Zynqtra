const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Initializing Zynqtra contracts with basic data...\n");

  // Read deployment info
  const fs = require("fs");
  const path = require("path");
  const deploymentFile = path.join(__dirname, "..", "deployments", "arbitrum-sepolia.json");
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Please run deployment first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contracts = deploymentInfo.contracts;

  // Get contract instances
  const [deployer] = await ethers.getSigners();
  console.log("Initializing with account:", deployer.address);

  const ZynqtraMain = await ethers.getContractFactory("ZynqtraMain");
  const mainContract = ZynqtraMain.attach(contracts.ZynqtraMain);

  const ZynqtraBadges = await ethers.getContractFactory("ZynqtraBadges");
  const badgesContract = ZynqtraBadges.attach(contracts.ZynqtraBadges);

  const ZynqtraChallenges = await ethers.getContractFactory("ZynqtraChallenges");
  const challengesContract = ZynqtraChallenges.attach(contracts.ZynqtraChallenges);

  try {
    // Create initial badges
    console.log("🏆 Creating initial badges...");
    
    const initialBadges = [
      {
        name: "First Connection",
        description: "Made your first connection on Zynqtra",
        ipfsMetadata: "QmFirstConnection...",
        badgeType: 0, // Achievement
        rarity: 0, // Common
        pointsRequired: 0,
        maxSupply: 10000,
        isTransferable: false,
        collection: "networking"
      },
      {
        name: "Event Attendee",
        description: "Attended your first event",
        ipfsMetadata: "QmEventAttendee...",
        badgeType: 3, // Event
        rarity: 0, // Common
        pointsRequired: 0,
        maxSupply: 10000,
        isTransferable: false,
        collection: "events"
      },
      {
        name: "Super Connector",
        description: "Made 50+ connections",
        ipfsMetadata: "QmSuperConnector...",
        badgeType: 4, // Social
        rarity: 2, // Rare
        pointsRequired: 1250,
        maxSupply: 1000,
        isTransferable: true,
        collection: "networking"
      },
      {
        name: "Event Champion",
        description: "Attended 10+ events",
        ipfsMetadata: "QmEventChampion...",
        badgeType: 3, // Event
        rarity: 2, // Rare
        pointsRequired: 500,
        maxSupply: 1000,
        isTransferable: true,
        collection: "events"
      },
      {
        name: "Challenge Master",
        description: "Completed 5+ challenges",
        ipfsMetadata: "QmChallengeMaster...",
        badgeType: 5, // Challenge
        rarity: 3, // Epic
        pointsRequired: 1000,
        maxSupply: 500,
        isTransferable: true,
        collection: "challenges"
      }
    ];

    for (const badge of initialBadges) {
      try {
        const tx = await badgesContract.createBadge(
          badge.name,
          badge.description,
          badge.ipfsMetadata,
          badge.badgeType,
          badge.rarity,
          badge.pointsRequired,
          badge.maxSupply,
          badge.isTransferable,
          badge.collection
        );
        await tx.wait();
        console.log(`✅ Created badge: ${badge.name}`);
      } catch (error) {
        console.log(`❌ Failed to create badge ${badge.name}:`, error.message);
      }
    }

    // Add badge requirements
    console.log("\n📋 Adding badge requirements...");
    
    try {
      // First Connection badge - requires 1 connection
      await badgesContract.addBadgeRequirement(1, "connections", 1);
      console.log("✅ Added requirement for First Connection badge");

      // Event Attendee badge - requires 1 event
      await badgesContract.addBadgeRequirement(2, "events", 1);
      console.log("✅ Added requirement for Event Attendee badge");

      // Super Connector badge - requires 50 connections
      await badgesContract.addBadgeRequirement(3, "connections", 50);
      console.log("✅ Added requirement for Super Connector badge");

      // Event Champion badge - requires 10 events
      await badgesContract.addBadgeRequirement(4, "events", 10);
      console.log("✅ Added requirement for Event Champion badge");

      // Challenge Master badge - requires 5 challenges
      await badgesContract.addBadgeRequirement(5, "challenges", 5);
      console.log("✅ Added requirement for Challenge Master badge");

    } catch (error) {
      console.log("❌ Failed to add badge requirements:", error.message);
    }

    // Create initial challenges
    console.log("\n🎯 Creating initial challenges...");
    
    const initialChallenges = [
      {
        title: "Welcome to Zynqtra",
        description: "Complete your profile and make your first connection",
        challengeType: 0, // Networking
        pointsReward: 100,
        badgeReward: 1, // First Connection badge
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
        maxParticipants: 10000,
        requiresEvent: false,
        requiredEventId: 0,
        requirements: ["Complete profile", "Make 1 connection"],
        ipfsMetadata: "QmWelcomeChallenge...",
        category: "onboarding"
      },
      {
        title: "Event Explorer",
        description: "Attend your first networking event",
        challengeType: 1, // Event
        pointsReward: 150,
        badgeReward: 2, // Event Attendee badge
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
        maxParticipants: 10000,
        requiresEvent: true,
        requiredEventId: 0,
        requirements: ["Register for an event", "Check in at event", "Complete event"],
        ipfsMetadata: "QmEventExplorer...",
        category: "events"
      }
    ];

    for (const challenge of initialChallenges) {
      try {
        const tx = await challengesContract.createChallenge(
          challenge.title,
          challenge.description,
          challenge.challengeType,
          challenge.pointsReward,
          challenge.badgeReward,
          challenge.startTime,
          challenge.endTime,
          challenge.maxParticipants,
          challenge.requiresEvent,
          challenge.requiredEventId,
          challenge.requirements,
          challenge.ipfsMetadata,
          challenge.category
        );
        await tx.wait();
        console.log(`✅ Created challenge: ${challenge.title}`);
      } catch (error) {
        console.log(`❌ Failed to create challenge ${challenge.title}:`, error.message);
      }
    }

    // Create initial mini-games
    console.log("\n🎮 Creating initial mini-games...");
    
    const initialGames = [
      {
        name: "Web3 Trivia",
        gameType: 0, // Trivia
        pointsReward: 50,
        maxScore: 100,
        gameData: JSON.stringify({
          questions: [
            { question: "What is blockchain?", options: ["A distributed ledger", "A type of database", "A cryptocurrency", "A programming language"], correct: 0 },
            { question: "What is DeFi?", options: ["Decentralized Finance", "Digital Finance", "Distributed Finance", "Dynamic Finance"], correct: 0 }
          ],
          timeLimit: 300 // 5 minutes
        })
      },
      {
        name: "Memory Match",
        gameType: 1, // Memory
        pointsReward: 30,
        maxScore: 100,
        gameData: JSON.stringify({
          gridSize: 4,
          timeLimit: 180, // 3 minutes
          cards: ["Web3", "Blockchain", "NFT", "DeFi", "DAO", "Smart Contract", "DApp", "Token"]
        })
      }
    ];

    for (const game of initialGames) {
      try {
        const tx = await challengesContract.createMiniGame(
          game.name,
          game.gameType,
          game.pointsReward,
          game.maxScore,
          game.gameData
        );
        await tx.wait();
        console.log(`✅ Created mini-game: ${game.name}`);
      } catch (error) {
        console.log(`❌ Failed to create mini-game ${game.name}:`, error.message);
      }
    }

    console.log("\n🎉 Initialization completed successfully!");
    console.log("\nCreated:");
    console.log("- 5 initial badges with requirements");
    console.log("- 2 initial challenges");
    console.log("- 2 initial mini-games");

  } catch (error) {
    console.error("❌ Initialization failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Initialization script failed:", error);
    process.exit(1);
  });
