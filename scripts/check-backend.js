const http = require('http');

// Define the backend URL to check - update this to your actual backend URL
const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log(`Checking backend service at: ${backendUrl}`);

// Parse the URL
const urlParts = new URL(backendUrl);

// Options for the HTTP request
const options = {
  hostname: urlParts.hostname,
  port: urlParts.port || 80,
  path: '/api/health', // Commonly used health check endpoint
  method: 'GET',
  timeout: 5000 // 5 seconds timeout
};

// Attempt to connect to the backend
const req = http.request(options, (res) => {
  console.log(`Backend responded with status code: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Backend service is running properly');
    process.exit(0);
  } else {
    console.log('⚠️ Backend service returned an unexpected status code');
    process.exit(1);
  }
});

// Handle errors
req.on('error', (error) => {
  console.error('❌ Backend service check failed with error:', error.message);
  console.log('The backend service does not appear to be running.');
  console.log('If you have a separate backend service, make sure it is started.');
  process.exit(1);
});

// Handle timeout
req.on('timeout', () => {
  console.error('❌ Backend service check timed out after 5 seconds');
  console.log('The backend service does not appear to be running or is responding slowly.');
  req.destroy();
  process.exit(1);
});

// End the request
req.end();
