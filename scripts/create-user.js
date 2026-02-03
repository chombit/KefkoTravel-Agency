const { prisma } = require('../lib/prisma');
const bcrypt = require('bcryptjs');

require('dotenv').config();

async function createUsers() {
  try {
    console.log('Creating test users...');

    // Create test user
    const testPassword = await bcrypt.hash('password123', 10);
    const testUser = await prisma.user.upsert({
      where: { email: 'test@kefkotravel.com' },
      update: {},
      create: {
        email: 'test@kefkotravel.com',
        name: 'Test User',
        password: testPassword,
        role: 'USER',
        phone: '+251911234567',
        nationality: 'Ethiopian',
      },
    });

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@kefkotravel.com' },
      update: {},
      create: {
        email: 'admin@kefkotravel.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        phone: '+251911234568',
        nationality: 'Ethiopian',
      },
    });

    console.log('✅ Users created successfully!');
    console.log('📧 Test user: test@kefkotravel.com / password123');
    console.log('👑 Admin user: admin@kefkotravel.com / admin123');
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();
