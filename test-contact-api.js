const http = require('http');

// Test the contact API
const contactData = {
  fullName: "Test User",
  email: "test@example.com",
  phone: "+251911123456",
  message: "This is a test message from the API test"
};

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(contactData))
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('✅ Contact API working!');
      console.log('Response:', parsed);
    } catch (e) {
      console.log('❌ Failed to parse JSON');
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(JSON.stringify(contactData));
req.end();
