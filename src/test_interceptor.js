// src/test_interceptor.js
import { SetUpMockLocalStorage } from './mock_storage.js';

// Setup mock localStorage before importing authService / apiClient
SetUpMockLocalStorage();

import axios from 'axios';
// Import apiClient and authService (with .ts extensions)
import { apiClient } from './lib/api/client.ts';
import { authService } from './features/auth/services/authService.ts';

const email = 'company123@gmail.com';
const password = 'P@ssword123';

async function testInterceptor() {
  console.log('1. Logging in via authService to populate localStorage...');
  const BASE_URL = 'https://careerpathfinal.runasp.net';
  
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth`, { email, password });
    const { id, firstName, lastName, email: userEmail, token, refreshToken, expiresIn, refreshTokenExpiration } = loginResponse.data;
    
    const user = { id, firstName, lastName, email: userEmail };
    authService.setAuthData(user, token, refreshToken, expiresIn, refreshTokenExpiration);
    
    console.log('✅ Logged in successfully. Current token:', authService.getToken().substring(0, 15) + '...');
    
    // Now, corrupt/expire the token by writing a dummy expired token to localStorage
    // This will force the next API call to return a 401, triggering our response interceptor!
    console.log('\n2. Corrupting access token in localStorage to force a 401 on next request...');
    const corruptedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTllMTNkNi1kOTRkLTc5NjUtYTVmNi03YjhlNzdjMDUxNjgiLCJlbWFpbCI6ImNvbXBhbnkxMjNAZ21haWwuY29tIiwiZXhwIjoxNzAwMDAwMDAwfQ.invalid-signature';
    localStorage.setItem('auth_token', corruptedToken);
    
    console.log('Current stored token is now invalid/expired.');
    console.log('Making a request to /UserProfile using apiClient...');
    
    // Call getMe() which does GET /UserProfile
    const profile = await apiClient.getMe();
    console.log('✅ apiClient.getMe() call succeeded! Profile returned:', profile.firstName, profile.lastName);
    console.log('New valid token in storage:', authService.getToken().substring(0, 15) + '...');
    
  } catch (error) {
    console.error('❌ Interceptor flow failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
      if (error.stack) console.error(error.stack);
    }
  }
}

testInterceptor();
