const { PrismaClient } = require('@prisma/client');

// Create Prisma client with configuration
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['warn', 'error'],
  errorFormat: 'pretty',
});

// Handle connection errors
prisma.$on('error', (e) => {
  console.error('Database error:', e);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('Disconnecting from database...');
  await prisma.$disconnect();
});

module.exports = prisma;