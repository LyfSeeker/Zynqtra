const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Zynqtra Contracts", function () {
  let profileContract, eventsContract, badgesContract, challengesContract, mainContract;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contracts
    const ZynqtraProfile = await ethers.getContractFactory("ZynqtraProfile");
    profileContract = await ZynqtraProfile.deploy();
    await profileContract.waitForDeployment();

    const ZynqtraEvents = await ethers.getContractFactory("ZynqtraEvents");
    eventsContract = await ZynqtraEvents.deploy();
    await eventsContract.waitForDeployment();

    const ZynqtraBadges = await ethers.getContractFactory("ZynqtraBadges");
    badgesContract = await ZynqtraBadges.deploy();
    await badgesContract.waitForDeployment();

    const ZynqtraChallenges = await ethers.getContractFactory("ZynqtraChallenges");
    challengesContract = await ZynqtraChallenges.deploy();
    await challengesContract.waitForDeployment();

    const ZynqtraMain = await ethers.getContractFactory("ZynqtraMain");
    mainContract = await ZynqtraMain.deploy(
      await profileContract.getAddress(),
      await eventsContract.getAddress(),
      await badgesContract.getAddress(),
      await challengesContract.getAddress()
    );
    await mainContract.waitForDeployment();
  });

  describe("Profile Management", function () {
    it("Should create a profile successfully", async function () {
      const interests = ["Web3", "Networking"];
      
      await mainContract.connect(user1).createProfile(
        "John Doe",
        "john@example.com",
        interests,
        "QmHash...",
        "johndoe",
        "johndoe"
      );

      const profile = await profileContract.getProfile(user1.address);
      expect(profile.name).to.equal("John Doe");
      expect(profile.email).to.equal("john@example.com");
      expect(profile.interests).to.deep.equal(interests);
    });

    it("Should not allow duplicate profiles", async function () {
      const interests = ["Web3"];
      
      await mainContract.connect(user1).createProfile(
        "John Doe",
        "john@example.com",
        interests,
        "QmHash...",
        "johndoe",
        "johndoe"
      );

      await expect(
        mainContract.connect(user1).createProfile(
          "John Doe",
          "john@example.com",
          interests,
          "QmHash...",
          "johndoe",
          "johndoe"
        )
      ).to.be.revertedWith("Profile already exists");
    });
  });

  describe("Connection System", function () {
    beforeEach(async function () {
      const interests = ["Web3"];
      
      await mainContract.connect(user1).createProfile(
        "User 1",
        "user1@example.com",
        interests,
        "QmHash1...",
        "user1",
        "user1"
      );

      await mainContract.connect(user2).createProfile(
        "User 2",
        "user2@example.com",
        interests,
        "QmHash2...",
        "user2",
        "user2"
      );
    });

    it("Should allow users to send connection requests", async function () {
      await mainContract.connect(user1).sendConnectionRequest(user2.address);
      
      const pendingRequests = await profileContract.getPendingRequests(user2.address);
      expect(pendingRequests.length).to.equal(1);
      expect(pendingRequests[0].from).to.equal(user1.address);
    });

    it("Should allow users to accept connection requests", async function () {
      await mainContract.connect(user1).sendConnectionRequest(user2.address);
      await mainContract.connect(user2).acceptConnectionRequest(user1.address);
      
      const isConnected = await profileContract.isConnected(user1.address, user2.address);
      expect(isConnected).to.be.true;
    });
  });

  describe("Badge System", function () {
    it("Should create a badge successfully", async function () {
      await badgesContract.createBadge(
        "Test Badge",
        "A test badge",
        "QmBadgeHash...",
        0, // Achievement
        0, // Common
        0,
        1000,
        false,
        "test"
      );

      const badge = await badgesContract.getBadge(1);
      expect(badge.name).to.equal("Test Badge");
      expect(badge.description).to.equal("A test badge");
    });

    it("Should award a badge to a user", async function () {
      await badgesContract.createBadge(
        "Test Badge",
        "A test badge",
        "QmBadgeHash...",
        0, // Achievement
        0, // Common
        0,
        1000,
        false,
        "test"
      );

      const interests = ["Web3"];
      await mainContract.connect(user1).createProfile(
        "User 1",
        "user1@example.com",
        interests,
        "QmHash1...",
        "user1",
        "user1"
      );

      await badgesContract.awardBadge(user1.address, 1, "test");
      
      const hasBadge = await badgesContract.hasBadge(user1.address, 1);
      expect(hasBadge).to.be.true;
    });
  });

  describe("Event System", function () {
    beforeEach(async function () {
      const interests = ["Web3"];
      await mainContract.connect(user1).createProfile(
        "User 1",
        "user1@example.com",
        interests,
        "QmHash1...",
        "user1",
        "user1"
      );
    });

    it("Should create an event successfully", async function () {
      const targetInterests = ["Web3"];
      const startTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const endTime = startTime + 3600; // 1 hour duration

      const tx = await mainContract.connect(user1).createEvent(
        "Test Event",
        "A test networking event",
        "San Francisco, CA",
        "QmEventHash...",
        startTime,
        endTime,
        100,
        ethers.parseEther("0.01"),
        0, // Networking
        targetInterests,
        100,
        false
      );

      await expect(tx).to.emit(eventsContract, "EventCreated");
    });
  });

  describe("Challenge System", function () {
    it("Should create a challenge successfully", async function () {
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + 86400; // 1 day
      const requirements = ["Complete profile", "Make connection"];

      await challengesContract.createChallenge(
        "Test Challenge",
        "A test challenge",
        0, // Networking
        100,
        0,
        startTime,
        endTime,
        1000,
        false,
        0,
        requirements,
        "QmChallengeHash...",
        "test"
      );

      const challenge = await challengesContract.getChallenge(1);
      expect(challenge.title).to.equal("Test Challenge");
      expect(challenge.description).to.equal("A test challenge");
    });
  });
});
