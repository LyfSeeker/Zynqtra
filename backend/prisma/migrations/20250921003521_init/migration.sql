-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "bio" TEXT,
    "ipfsHash" TEXT,
    "profileTokenId" BIGINT,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "linkedinUsername" TEXT,
    "twitterUsername" TEXT,
    "githubUsername" TEXT,
    "profileImageUrl" TEXT,
    "interests" JSONB,
    "skills" JSONB,
    "location" TEXT,
    "eventsAttended" INTEGER NOT NULL DEFAULT 0,
    "eventsHosted" INTEGER NOT NULL DEFAULT 0,
    "connectionsCount" INTEGER NOT NULL DEFAULT 0,
    "badgesEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastActive" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" BIGINT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ipfsHash" TEXT,
    "hostId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "maxAttendees" INTEGER NOT NULL,
    "registrationFee" BIGINT NOT NULL DEFAULT 0,
    "eventType" INTEGER NOT NULL DEFAULT 0,
    "pointsReward" INTEGER NOT NULL DEFAULT 0,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "targetInterests" JSONB,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "txHash" TEXT,
    "blockNumber" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" DATETIME,
    "qrCodeHash" TEXT,
    "txHash" TEXT,
    "blockNumber" BIGINT,
    CONSTRAINT "event_attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "event_attendances_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badgeId" BIGINT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ipfsHash" TEXT,
    "imageUrl" TEXT,
    "badgeType" INTEGER NOT NULL DEFAULT 0,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "pointsRequired" INTEGER NOT NULL DEFAULT 0,
    "maxSupply" INTEGER,
    "currentSupply" INTEGER NOT NULL DEFAULT 0,
    "isTransferable" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "creatorAddress" TEXT,
    "txHash" TEXT,
    "blockNumber" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "awardedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txHash" TEXT,
    "blockNumber" BIGINT,
    "tokenId" BIGINT,
    CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "connections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" DATETIME,
    "txHash" TEXT,
    "blockNumber" BIGINT,
    CONSTRAINT "connections_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "connections_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "challengeId" BIGINT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ipfsHash" TEXT,
    "challengeType" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL DEFAULT 'EASY',
    "pointsReward" INTEGER NOT NULL DEFAULT 0,
    "timeLimit" INTEGER,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "requirements" JSONB,
    "validationCriteria" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "creatorAddress" TEXT,
    "txHash" TEXT,
    "blockNumber" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_challenges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "submissionData" JSONB,
    "score" INTEGER,
    "txHash" TEXT,
    "blockNumber" BIGINT,
    CONSTRAINT "user_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_challenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ipfs_content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hash" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" BIGINT,
    "mimeType" TEXT,
    "filename" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "pinnedAt" DATETIME,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccessed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "txHash" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "blockHash" TEXT,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT,
    "gasUsed" BIGINT,
    "gasPrice" BIGINT,
    "value" BIGINT,
    "contractAddress" TEXT,
    "functionName" TEXT,
    "functionArgs" JSONB,
    "eventName" TEXT,
    "eventArgs" JSONB,
    "entityType" TEXT,
    "entityId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "confirmations" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "timestamp" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "points_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "points_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendances_userId_eventId_key" ON "event_attendances"("userId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "connections_fromUserId_toUserId_key" ON "connections"("fromUserId", "toUserId");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenges_userId_challengeId_key" ON "user_challenges"("userId", "challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "ipfs_content_hash_key" ON "ipfs_content"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_txHash_key" ON "transactions"("txHash");
