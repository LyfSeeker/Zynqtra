# Zynqtra Smart Contracts Deployment Guide

This guide will walk you through deploying the Zynqtra smart contracts to Arbitrum Sepolia testnet.

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **MetaMask** or compatible wallet
4. **Arbitrum Sepolia ETH** for gas fees
5. **Arbiscan API Key** (optional, for contract verification)

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Hardhat
- OpenZeppelin contracts
- Ethers.js
- Hardhat plugins

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` file with your values:
```env
# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Arbiscan API key for contract verification (optional)
ARBISCAN_API_KEY=your_arbiscan_api_key_here

# Gas reporting (optional)
REPORT_GAS=true
```

**⚠️ Security Warning**: Never commit your `.env` file to version control!

## Step 3: Get Arbitrum Sepolia ETH

You'll need ETH on Arbitrum Sepolia for gas fees:

1. **Arbitrum Sepolia Faucet**: https://faucet.quicknode.com/arbitrum/sepolia
2. **Chainlink Faucet**: https://faucets.chain.link/arbitrum-sepolia
3. **Alchemy Faucet**: https://sepoliafaucet.com/

## Step 4: Compile Contracts

```bash
npm run compile
```

This will compile all contracts and check for any compilation errors.

## Step 5: Run Tests (Optional)

```bash
npm test
```

This will run the test suite to ensure contracts work correctly.

## Step 6: Deploy Contracts

```bash
npm run deploy:arbitrum-sepolia
```

This will:
1. Deploy all 5 contracts in the correct order
2. Save deployment information to `deployments/arbitrum-sepolia.json`
3. Display contract addresses and deployment summary

### Expected Output:
```
🚀 Starting Zynqtra contracts deployment on Arbitrum Sepolia...

Deploying contracts with account: 0x...
Account balance: 0.1 ETH

📄 Deploying ZynqtraProfile...
✅ ZynqtraProfile deployed to: 0x...

🎪 Deploying ZynqtraEvents...
✅ ZynqtraEvents deployed to: 0x...

🏆 Deploying ZynqtraBadges...
✅ ZynqtraBadges deployed to: 0x...

🎮 Deploying ZynqtraChallenges...
✅ ZynqtraChallenges deployed to: 0x...

🔗 Deploying ZynqtraMain (Integration Contract)...
✅ ZynqtraMain deployed to: 0x...

📋 Deployment Summary:
=====================
Network: Arbitrum Sepolia
Chain ID: 421614
Deployer: 0x...

Contract Addresses:
ZynqtraProfile: 0x...
ZynqtraEvents: 0x...
ZynqtraBadges: 0x...
ZynqtraChallenges: 0x...
ZynqtraMain: 0x...

🎉 All contracts deployed successfully!
```

## Step 7: Verify Contracts (Optional)

```bash
npm run verify:arbitrum-sepolia
```

This will verify all contracts on Arbiscan, making the source code publicly available.

## Step 8: Initialize Contracts (Optional)

```bash
npx hardhat run scripts/initialize.js --network arbitrum-sepolia
```

This will create initial badges, challenges, and mini-games for testing.

## Step 9: Update Frontend Configuration

Update your frontend configuration with the deployed contract addresses:

1. Open `frontend/lib/wagmi-config.ts`
2. Update the contract addresses:

```typescript
export const ZYNQTRA_CONTRACTS = {
  ZynqtraProfile: "0x...", // Your deployed address
  ZynqtraEvents: "0x...",  // Your deployed address
  ZynqtraBadges: "0x...",  // Your deployed address
  ZynqtraChallenges: "0x...", // Your deployed address
  ZynqtraMain: "0x...",    // Your deployed address
} as const;
```

## Contract Addresses

After deployment, your contracts will be available at:

- **ZynqtraProfile**: User profiles and connections
- **ZynqtraEvents**: Event management
- **ZynqtraBadges**: Achievement badges
- **ZynqtraChallenges**: Challenges and mini-games
- **ZynqtraMain**: Main integration contract (use this for most interactions)

## Network Configuration

### Arbitrum Sepolia Details:
- **Network Name**: Arbitrum Sepolia
- **RPC URL**: https://sepolia-rollup.arbitrum.io/rpc
- **Chain ID**: 421614
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.arbiscan.io/

### Adding to MetaMask:
1. Open MetaMask
2. Click "Add Network"
3. Enter the network details above
4. Save and switch to Arbitrum Sepolia

## Troubleshooting

### Common Issues:

1. **"Insufficient funds" error**:
   - Get more ETH from faucets
   - Check your account balance

2. **"Nonce too low" error**:
   - Wait a few minutes and try again
   - Reset your MetaMask account

3. **"Gas estimation failed" error**:
   - Increase gas limit in deployment script
   - Check contract constructor parameters

4. **"Contract verification failed" error**:
   - Ensure constructor arguments are correct
   - Wait a few minutes after deployment before verifying

### Gas Optimization:

The contracts are optimized for gas efficiency, but you can further optimize by:
- Using batch operations
- Minimizing storage operations
- Using efficient data structures

## Security Considerations

1. **Private Key Security**:
   - Never share your private key
   - Use environment variables
   - Consider using a hardware wallet for mainnet

2. **Contract Verification**:
   - Always verify contracts on block explorer
   - Double-check constructor arguments

3. **Testing**:
   - Test thoroughly on testnet before mainnet
   - Use multiple test accounts
   - Test edge cases and error conditions

## Next Steps

After successful deployment:

1. **Test Contract Interactions**:
   - Create profiles
   - Make connections
   - Create and join events
   - Earn badges and complete challenges

2. **Frontend Integration**:
   - Update contract addresses
   - Test all frontend features
   - Implement error handling

3. **Production Deployment**:
   - Deploy to Arbitrum mainnet
   - Set up monitoring
   - Implement upgrade mechanisms

## Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the contract documentation
3. Check the deployment logs
4. Contact the development team

## Contract Explorer Links

After deployment, you can view your contracts on:
- **Arbiscan**: https://sepolia.arbiscan.io/
- **Arbitrum Explorer**: https://sepolia-explorer.arbitrum.io/

Remember to save your contract addresses and deployment information for future reference!
