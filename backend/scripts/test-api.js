#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing Zynqtra Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);

    // Test API root
    console.log('\n2. Testing API root...');
    const apiResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ API root accessible:', apiResponse.data.message);

    // Test users endpoint (should return validation error)
    console.log('\n3. Testing users endpoint...');
    try {
      await axios.post(`${BASE_URL}/api/users/profile`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ User validation working (expected 400 error)');
      } else {
        throw error;
      }
    }

    // Test events endpoint
    console.log('\n4. Testing events endpoint...');
    const eventsResponse = await axios.get(`${BASE_URL}/api/events`);
    console.log('✅ Events endpoint accessible:', eventsResponse.data.success);

    // Test badges endpoint
    console.log('\n5. Testing badges endpoint...');
    const badgesResponse = await axios.get(`${BASE_URL}/api/badges`);
    console.log('✅ Badges endpoint accessible:', badgesResponse.data.success);

    console.log('\n🎉 All basic API tests passed!');
    console.log('\nAPI endpoints available:');
    console.log('- GET  /health - Health check');
    console.log('- GET  /api - API information');
    console.log('- POST /api/users/profile - Create user profile');
    console.log('- GET  /api/users/profile/:walletAddress - Get user profile');
    console.log('- GET  /api/events - Get events');
    console.log('- POST /api/events - Create event');
    console.log('- GET  /api/badges - Get badges');
    console.log('- POST /api/badges - Create badge');
    console.log('- POST /api/upload/upload - Upload files to IPFS');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   npm run dev');
    }
    process.exit(1);
  }
}

// Test if server is running
if (require.main === module) {
  testBackend();
}

module.exports = { testBackend };