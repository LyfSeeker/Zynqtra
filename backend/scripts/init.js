#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Initializing Zynqtra Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Creating from env.example...');
  const envExamplePath = path.join(__dirname, '../../env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created. Please update it with your configuration.\n');
  } else {
    console.log('❌ env.example file not found. Please create .env file manually.\n');
    process.exit(1);
  }
}

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '../..') });
  console.log('✅ Dependencies installed successfully\n');

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created\n');
  }

  // Generate Prisma client
  console.log('🗃️  Setting up database...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '../..') });
    console.log('✅ Prisma client generated successfully\n');
  } catch (error) {
    console.log('⚠️  Prisma generate failed. Make sure your DATABASE_URL is configured.\n');
  }

  // Check if smart contract addresses are configured
  require('dotenv').config({ path: envPath });
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'IPFS_PROJECT_ID',
    'IPFS_PROJECT_SECRET',
    'PRIVATE_KEY',
    'ARBITRUM_RPC_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\nPlease update your .env file with the missing variables.\n');
  } else {
    console.log('✅ All required environment variables are configured\n');
  }

  console.log('🎉 Backend initialization completed!\n');
  console.log('Next steps:');
  console.log('1. Update your .env file with the correct values');
  console.log('2. Run database migrations: npm run migrate');
  console.log('3. Start the development server: npm run dev');
  console.log('4. The API will be available at: http://localhost:5000/api\n');
  
} catch (error) {
  console.error('❌ Initialization failed:', error.message);
  process.exit(1);
}