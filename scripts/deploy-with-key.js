const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Zynqtra contracts deployment on Arbitrum Sepolia...\n");

  // Use the private key directly (replace with your actual private key)
  const privateKey = "25bc84a1e110704505f8d51e0356401d4b1520b43ab80299d86d7a28e1d41066";
  const wallet = new ethers.Wallet(privateKey, ethers.provider);
  
  console.log("Deploying contracts with account:", wallet.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(wallet.address)), "ETH\n");

  // Deploy contracts in order
  console.log("📄 Deploying ZynqtraProfile...");
  const ZynqtraProfile = await ethers.getContractFactory("ZynqtraProfile");
  const profileContract = await ZynqtraProfile.connect(wallet).deploy();
  await profileContract.waitForDeployment();
  const profileAddress = await profileContract.getAddress();
  console.log("✅ ZynqtraProfile deployed to:", profileAddress);

  console.log("\n🎪 Deploying ZynqtraEvents...");
  const ZynqtraEvents = await ethers.getContractFactory("ZynqtraEvents");
  const eventsContract = await ZynqtraEvents.connect(wallet).deploy();
  await eventsContract.waitForDeployment();
  const eventsAddress = await eventsContract.getAddress();
  console.log("✅ ZynqtraEvents deployed to:", eventsAddress);

  console.log("\n🏆 Deploying ZynqtraBadges...");
  const ZynqtraBadges = await ethers.getContractFactory("ZynqtraBadges");
  const badgesContract = await ZynqtraBadges.connect(wallet).deploy();
  await badgesContract.waitForDeployment();
  const badgesAddress = await badgesContract.getAddress();
  console.log("✅ ZynqtraBadges deployed to:", badgesAddress);

  console.log("\n🎮 Deploying ZynqtraChallenges...");
  const ZynqtraChallenges = await ethers.getContractFactory("ZynqtraChallenges");
  const challengesContract = await ZynqtraChallenges.connect(wallet).deploy();
  await challengesContract.waitForDeployment();
  const challengesAddress = await challengesContract.getAddress();
  console.log("✅ ZynqtraChallenges deployed to:", challengesAddress);

  console.log("\n🔗 Deploying ZynqtraMain (Integration Contract)...");
  const ZynqtraMain = await ethers.getContractFactory("ZynqtraMain");
  const mainContract = await ZynqtraMain.connect(wallet).deploy(
    profileAddress,
    eventsAddress,
    badgesAddress,
    challengesAddress
  );
  await mainContract.waitForDeployment();
  const mainAddress = await mainContract.getAddress();
  console.log("✅ ZynqtraMain deployed to:", mainAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "arbitrum-sepolia",
    chainId: 421614,
    deployer: wallet.address,
    contracts: {
      ZynqtraProfile: profileAddress,
      ZynqtraEvents: eventsAddress,
      ZynqtraBadges: badgesAddress,
      ZynqtraChallenges: challengesAddress,
      ZynqtraMain: mainAddress,
    },
    deploymentTime: new Date().toISOString(),
  };

  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, "arbitrum-sepolia.json");
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n📋 Deployment Summary:");
  console.log("=====================");
  console.log("Network: Arbitrum Sepolia");
  console.log("Chain ID: 421614");
  console.log("Deployer:", wallet.address);
  console.log("\nContract Addresses:");
  console.log("ZynqtraProfile:", profileAddress);
  console.log("ZynqtraEvents:", eventsAddress);
  console.log("ZynqtraBadges:", badgesAddress);
  console.log("ZynqtraChallenges:", challengesAddress);
  console.log("ZynqtraMain:", mainAddress);
  console.log("\n📁 Deployment info saved to:", deploymentFile);

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\nNext steps:");
  console.log("1. Verify contracts: npm run verify:arbitrum-sepolia");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test contract interactions");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
