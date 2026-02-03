const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAgent() {
  const uri = "mongodb://localhost:27017/kefko-travel";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('kefko-travel');
    const usersCollection = db.collection('User');

    // Check if agent already exists
    const existingAgent = await usersCollection.findOne({ email: 'agent@kefkotravel.com' });
    if (existingAgent) {
      console.log('❌ Agent user already exists');
      return;
    }

    // Create agent user
    const hashedPassword = await bcrypt.hash('agent123', 12);
    
    const result = await usersCollection.insertOne({
      name: 'Agent User',
      email: 'agent@kefkotravel.com',
      password: hashedPassword,
      role: 'AGENT',
      phone: '+251911234569',
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Agent user created successfully!');
    console.log('📧 Email: agent@kefkotravel.com');
    console.log('🔑 Password: agent123');
    console.log('🎫 Role: AGENT');

  } catch (error) {
    console.error('❌ Error creating agent:', error);
  } finally {
    await client.close();
  }
}

createAgent();
