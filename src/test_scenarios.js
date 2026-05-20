// src/test_scenarios.js
import axios from 'axios';

const email = 'company123@gmail.com';
const password = 'P@ssword123';
const BASE_URL = 'https://careerpathfinal.runasp.net';

async function runScenarios() {
  console.log('--- 1. Login ---');
  let token, refreshToken;
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth`, { email, password });
    token = loginResponse.data.token;
    refreshToken = loginResponse.data.refreshToken;
    console.log('✅ Login Succeeded!');
    console.log('Token (truncated):', token.substring(0, 30) + '...');
    console.log('Refresh Token:', refreshToken);
  } catch (error) {
    console.error('❌ Login Failed:', error.response?.data || error.message);
    return;
  }

  console.log('\n--- 2. First Refresh (using valid tokens) ---');
  let newToken, newRefreshToken;
  try {
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, { token, refreshToken });
    newToken = refreshResponse.data.token;
    newRefreshToken = refreshResponse.data.refreshToken;
    console.log('✅ First Refresh Succeeded!');
    console.log('New Token (truncated):', newToken.substring(0, 30) + '...');
    console.log('New Refresh Token:', newRefreshToken);
  } catch (error) {
    console.error('❌ First Refresh Failed:', error.response?.data || error.message);
  }

  console.log('\n--- 3. Second Refresh (using the OLD rotated refresh token again) ---');
  try {
    const secondRefreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, { token, refreshToken });
    console.log('✅ Second Refresh Succeeded? (This should not happen under rotation!):', secondRefreshResponse.data);
  } catch (error) {
    console.log('❌ Second Refresh Failed as expected (rotation security):');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }

  console.log('\n--- 4. Refresh using an expired/altered access token but valid refresh token ---');
  try {
    // Let's modify the access token signature to make it invalid, or wait for it to be invalid
    // If we just change a character in the signature, it's structurally valid but signature validation fails.
    const invalidToken = newToken.substring(0, newToken.length - 5) + 'xxxxx';
    console.log('Attempting refresh with invalid access token signature...');
    const invalidTokenRefreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, { 
      token: invalidToken, 
      refreshToken: newRefreshToken 
    });
    console.log('✅ Refresh with invalid token signature Succeeded:', invalidTokenRefreshResponse.data);
  } catch (error) {
    console.log('❌ Refresh with invalid token signature Failed:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

runScenarios();
