const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const uri = "mongodb://localhost:27017/kefko-travel";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('kefko-travel');
    const usersCollection = db.collection('User');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@kefkotravel.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const result = await usersCollection.insertOne({
      name: 'Admin User',
      email: 'admin@kefkotravel.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+251911234568',
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@kefkotravel.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: ADMIN');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await client.close();
  }
}

createAdmin();
