// test_refresh.js
import axios from 'axios';

const email = 'company123@gmail.com';
const password = 'P@ssword123';
const BASE_URL = 'https://careerpathfinal.runasp.net';

async function testFlow() {
  console.log('1. Trying to login...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth`, {
      email,
      password
    });
    
    console.log('✅ Login Response:', JSON.stringify(loginResponse.data, null, 2));
    
    const { token, refreshToken } = loginResponse.data;
    console.log('\n2. Got tokens. Attempting to call /auth/refresh immediately...');
    
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      token,
      refreshToken
    });
    
    console.log('✅ Refresh Response:', JSON.stringify(refreshResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Error occurred:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testFlow();
