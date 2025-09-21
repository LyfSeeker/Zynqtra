const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking Zynqtra Database...\n');
  
  try {
    // Test connection and get counts
    console.log('📊 Table Counts:');
    const userCount = await prisma.user.count();
    const eventCount = await prisma.event.count();
    const badgeCount = await prisma.badge.count();
    const pointsTransactionCount = await prisma.pointsTransaction.count();
    const activityLogCount = await prisma.activityLog.count();
    const connectionCount = await prisma.connection.count();
    
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📅 Events: ${eventCount}`);
    console.log(`   🏆 Badges: ${badgeCount}`);
    console.log(`   💰 Points Transactions: ${pointsTransactionCount}`);
    console.log(`   📝 Activity Logs: ${activityLogCount}`);
    console.log(`   🤝 Connections: ${connectionCount}`);
    
    // Sample users
    if (userCount > 0) {
      console.log('\n👥 Sample Users:');
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          walletAddress: true,
          totalPoints: true,
          level: true,
          eventsAttended: true,
          connectionsCount: true,
          badgesEarned: true,
          createdAt: true
        }
      });
      
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name || 'Anonymous'}`);
        console.log(`      💼 Wallet: ${user.walletAddress}`);
        console.log(`      💰 Points: ${user.totalPoints} (Level ${user.level})`);
        console.log(`      📈 Activity: ${user.eventsAttended} events, ${user.connectionsCount} connections, ${user.badgesEarned} badges`);
        console.log(`      📅 Joined: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }
    
    // Sample points transactions
    if (pointsTransactionCount > 0) {
      console.log('💰 Recent Points Transactions:');
      const transactions = await prisma.pointsTransaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, walletAddress: true }
          }
        }
      });
      
      transactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ${tx.user.name || 'Anonymous'}: ${tx.points > 0 ? '+' : ''}${tx.points} points`);
        console.log(`      🎯 Source: ${tx.source} | Type: ${tx.type}`);
        console.log(`      💰 Balance: ${tx.balanceBefore} → ${tx.balanceAfter}`);
        console.log(`      📅 Date: ${tx.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }
    
    // Sample activity logs
    if (activityLogCount > 0) {
      console.log('📝 Recent Activity:');
      const activities = await prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, walletAddress: true }
          }
        }
      });
      
      activities.forEach((activity, index) => {
        console.log(`   ${index + 1}. ${activity.user.name || 'Anonymous'}: ${activity.action}`);
        console.log(`      🎯 Entity: ${activity.entityType}${activity.entityId ? ' (' + activity.entityId + ')' : ''}`);
        console.log(`      📅 Date: ${activity.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }
    
    console.log('✅ Database check completed successfully!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    
    if (error.code === 'P1001') {
      console.log('💡 Database server is not running or unreachable');
    } else if (error.code === 'P1003') {
      console.log('💡 Database does not exist');
    } else {
      console.log('💡 Make sure you have run: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();