const { run } = require("hardhat");

async function main() {
  console.log("🔍 Starting contract verification on Arbitrum Sepolia...\n");

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

  console.log("Verifying contracts deployed at:", deploymentInfo.deploymentTime);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("");

  try {
    // Verify ZynqtraProfile
    console.log("🔍 Verifying ZynqtraProfile...");
    await run("verify:verify", {
      address: contracts.ZynqtraProfile,
      constructorArguments: [],
    });
    console.log("✅ ZynqtraProfile verified");

    // Verify ZynqtraEvents
    console.log("\n🔍 Verifying ZynqtraEvents...");
    await run("verify:verify", {
      address: contracts.ZynqtraEvents,
      constructorArguments: [],
    });
    console.log("✅ ZynqtraEvents verified");

    // Verify ZynqtraBadges
    console.log("\n🔍 Verifying ZynqtraBadges...");
    await run("verify:verify", {
      address: contracts.ZynqtraBadges,
      constructorArguments: [],
    });
    console.log("✅ ZynqtraBadges verified");

    // Verify ZynqtraChallenges
    console.log("\n🔍 Verifying ZynqtraChallenges...");
    await run("verify:verify", {
      address: contracts.ZynqtraChallenges,
      constructorArguments: [],
    });
    console.log("✅ ZynqtraChallenges verified");

    // Verify ZynqtraMain
    console.log("\n🔍 Verifying ZynqtraMain...");
    await run("verify:verify", {
      address: contracts.ZynqtraMain,
      constructorArguments: [
        contracts.ZynqtraProfile,
        contracts.ZynqtraEvents,
        contracts.ZynqtraBadges,
        contracts.ZynqtraChallenges,
      ],
    });
    console.log("✅ ZynqtraMain verified");

    console.log("\n🎉 All contracts verified successfully!");
    console.log("\nContract Explorer Links:");
    console.log("========================");
    console.log("ZynqtraProfile:", `https://sepolia.arbiscan.io/address/${contracts.ZynqtraProfile}`);
    console.log("ZynqtraEvents:", `https://sepolia.arbiscan.io/address/${contracts.ZynqtraEvents}`);
    console.log("ZynqtraBadges:", `https://sepolia.arbiscan.io/address/${contracts.ZynqtraBadges}`);
    console.log("ZynqtraChallenges:", `https://sepolia.arbiscan.io/address/${contracts.ZynqtraChallenges}`);
    console.log("ZynqtraMain:", `https://sepolia.arbiscan.io/address/${contracts.ZynqtraMain}`);

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    
    // Try to verify individual contracts if batch verification fails
    console.log("\n🔄 Attempting individual contract verification...");
    
    const contractsToVerify = [
      { name: "ZynqtraProfile", address: contracts.ZynqtraProfile, args: [] },
      { name: "ZynqtraEvents", address: contracts.ZynqtraEvents, args: [] },
      { name: "ZynqtraBadges", address: contracts.ZynqtraBadges, args: [] },
      { name: "ZynqtraChallenges", address: contracts.ZynqtraChallenges, args: [] },
      { 
        name: "ZynqtraMain", 
        address: contracts.ZynqtraMain, 
        args: [
          contracts.ZynqtraProfile,
          contracts.ZynqtraEvents,
          contracts.ZynqtraBadges,
          contracts.ZynqtraChallenges,
        ]
      },
    ];

    for (const contract of contractsToVerify) {
      try {
        console.log(`\n🔍 Verifying ${contract.name}...`);
        await run("verify:verify", {
          address: contract.address,
          constructorArguments: contract.args,
        });
        console.log(`✅ ${contract.name} verified`);
      } catch (verifyError) {
        console.log(`❌ ${contract.name} verification failed:`, verifyError.message);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification script failed:", error);
    process.exit(1);
  });
