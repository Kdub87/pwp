const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('Testing PWP API endpoints...\n');

  try {
    // Test root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await axios.get(BASE_URL);
    console.log('✅ Root endpoint:', rootResponse.data);

    // Test API status
    console.log('\n2. Testing API status...');
    const apiResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ API status:', apiResponse.data);

    // Test loads endpoint
    console.log('\n3. Testing loads endpoint...');
    const loadsResponse = await axios.get(`${BASE_URL}/api/loads`);
    console.log('✅ Loads endpoint:', loadsResponse.data);

    // Test drivers endpoint
    console.log('\n4. Testing drivers endpoint...');
    const driversResponse = await axios.get(`${BASE_URL}/api/drivers`);
    console.log('✅ Drivers endpoint:', driversResponse.data);

    console.log('\n🎉 All API endpoints are working!');

  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();