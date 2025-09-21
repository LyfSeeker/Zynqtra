// Simple server starter that ensures correct working directory
const path = require('path');
const { spawn } = require('child_process');

// Get the backend directory path
const backendDir = path.join(__dirname);
console.log('Starting server from directory:', backendDir);

// Change to backend directory
process.chdir(backendDir);

// Start the server
require('./src/server.js');