const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb://localhost:27017/kefko-travel";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('kefko-travel');
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Test inserting a document
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log('✅ Test document inserted');
    
    await testCollection.deleteMany({});
    console.log('✅ Test documents cleaned up');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await client.close();
  }
}

testConnection();
