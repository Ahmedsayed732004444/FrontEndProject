# 🔄 Refresh Token Mechanism - Complete Guide

## ✅ How It Works Now

Your refresh token system now handles **all edge cases** properly:

---

## 🎯 Flow Diagram

```
User Request → 401 Unauthorized
    ↓
Is refresh already in progress?
    ├─ YES → Queue this request
    │         Wait for refresh to complete
    │         Retry with new token
    │
    └─ NO  → Start refresh process
              ↓
         Call /auth/refresh
              ↓
         Success?
         ├─ YES → Store new tokens
         │        Update failed request
         │        Process queue
         │        Retry all requests
         │
         └─ NO  → Clear auth data
                  Reject all queued requests
                  Redirect to /login
```

---

## 🔧 Implementation Details

### 1. **401 Detection**
```typescript
// Interceptor catches 401 response
if (error.response?.status === 401) {
  // Start refresh process
}
```

### 2. **Queue Management**
```typescript
// Multiple 401s during refresh → queue them
if (this.isRefreshingToken) {
  return new Promise((resolve, reject) => {
    this.failedQueue.push({ resolve, reject, config: originalRequest });
  });
}
```

### 3. **Token Refresh**
```typescript
// Call refresh endpoint
const refreshResponse = await authService.refreshToken();

// authService.updateTokens() automatically stores:
// ✅ New access token → localStorage['auth_token']
// ✅ New refresh token → localStorage['auth_refresh_token']
// ✅ Expiry time → localStorage['auth_expires_in']
// ✅ Issued timestamp → localStorage['auth_token_issued_at']
// ✅ Refresh token expiry → localStorage['auth_refresh_token_expiry']
```

### 4. **Request Retry**
```typescript
// Update original request with new token
originalRequest.headers.Authorization = `Bearer ${newToken}`;

// Retry the failed request
return this.client(originalRequest);
```

### 5. **Queue Processing**
```typescript
// Process all queued requests with new token
this.failedQueue.forEach((queuedRequest) => {
  queuedRequest.config.headers.Authorization = `Bearer ${token}`;
  this.client(queuedRequest.config)
    .then(response => queuedRequest.resolve(response))
    .catch(err => queuedRequest.reject(err));
});
```

---

## 🚨 Error Handling

### Scenario 1: Refresh Token Expired
```typescript
if (authService.isRefreshTokenExpired()) {
  ✅ Clear all auth data
  ✅ Redirect to /login
  ✅ Show error message
}
```

### Scenario 2: Refresh Endpoint Failed
```typescript
catch (refreshError) {
  ✅ Clear auth data
  ✅ Reject all queued requests
  ✅ Redirect to /login
}
```

### Scenario 3: Network Error During Refresh
```typescript
// Axios retry mechanism kicks in
// If still fails → redirect to login
```

---

## 📊 Token Storage

All tokens are stored in **localStorage**:

```typescript
localStorage['auth_token']                    // Access token (JWT)
localStorage['auth_refresh_token']            // Refresh token
localStorage['auth_expires_in']               // Token lifetime (seconds)
localStorage['auth_token_issued_at']          // When token was issued (timestamp)
localStorage['auth_refresh_token_expiry']     // Refresh token expiry (ISO date)
localStorage['auth_user']                     // User object (JSON)
```

---

## 🔍 Token Lifecycle

### Initial Login
```
1. User logs in
2. Backend returns:
   {
     token: "eyJhbGc...",
     refreshToken: "abc123...",
     expiresIn: 3600,  // 1 hour
     refreshTokenExpiration: "2024-06-01T12:00:00Z"
   }
3. authService.setAuthData() stores everything
```

### Access Token Expires
```
1. Request sent with expired token
2. Backend returns 401
3. Interceptor catches 401
4. Calls /auth/refresh
5. Backend returns new tokens
6. authService.updateTokens() stores new tokens
7. Original request retried with new token
```

### Multiple Concurrent 401s
```
Request A → 401 → Start refresh
Request B → 401 → Queue (wait for A's refresh)
Request C → 401 → Queue (wait for A's refresh)

Refresh completes → Process queue:
  - Retry Request A with new token
  - Retry Request B with new token
  - Retry Request C with new token
```

---

## ✅ Testing the Flow

### Test 1: Token Expiration
```typescript
// Simulate expired token
localStorage.setItem('auth_token', 'expired_token');

// Make any API request
await apiClient.get('/Jobs');

// Expected:
// 1. Request fails with 401
// 2. Refresh automatically triggered
// 3. New token stored
// 4. Request retried successfully
```

### Test 2: Multiple Simultaneous Requests
```typescript
// Make 5 requests at the same time with expired token
Promise.all([
  apiClient.get('/Jobs'),
  apiClient.get('/UserProfile'),
  apiClient.get('/Posts'),
  apiClient.get('/Roadmaps'),
  apiClient.get('/JobApplications')
]);

// Expected:
// 1. All 5 get 401
// 2. First one triggers refresh
// 3. Other 4 are queued
// 4. After refresh, all 5 retry with new token
// 5. Only ONE refresh call made (not 5!)
```

### Test 3: Refresh Token Expired
```typescript
// Set refresh token to expired date
localStorage.setItem('auth_refresh_token_expiry', '2020-01-01T00:00:00Z');

// Make any request
await apiClient.get('/Jobs');

// Expected:
// 1. Request fails with 401
// 2. Refresh attempted
// 3. Refresh token check fails
// 4. User logged out
// 5. Redirected to /login
```

---

## 🐛 Debugging

### Enable Console Logs
The refresh mechanism now logs every step:

```javascript
🔄 Token refresh in progress, queuing request...
🔄 Refreshing token...
✅ Token refreshed successfully
📋 Processing 3 queued requests...
🔁 Retrying original request with new token
```

Or on errors:
```javascript
❌ No valid refresh token available
❌ Token refresh failed: Error: Network error
```

---

## 🔒 Security Features

### 1. **Race Condition Prevention**
✅ Only ONE refresh request at a time (using `isRefreshingToken` flag)

### 2. **Token Expiry Checks**
✅ Proactive check before attempting refresh
✅ Validates refresh token expiry date

### 3. **Automatic Cleanup**
✅ Clear all auth data on refresh failure
✅ Clear queue on refresh failure

### 4. **No Token Leakage**
✅ Tokens only in localStorage (not in code)
✅ Auth endpoints excluded from interceptor

---

## 📝 Backend Requirements

Your backend must implement:

```typescript
POST /auth/refresh
Request:
{
  "token": "current_access_token",
  "refreshToken": "current_refresh_token"
}

Response (Success):
{
  "id": "user_id",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "token": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 3600,
  "refreshTokenExpiration": "2024-06-01T12:00:00Z"
}

Response (Error):
401 Unauthorized - Invalid or expired refresh token
```

---

## ⚡ Performance

### Before (Without Queue)
```
5 simultaneous 401s = 5 refresh calls = ❌ Bad
```

### After (With Queue)
```
5 simultaneous 401s = 1 refresh call + 4 queued = ✅ Good
```

---

## 🎯 Advantages

1. ✅ **Automatic** - User never sees expired token errors
2. ✅ **Efficient** - Single refresh call for multiple 401s
3. ✅ **Seamless** - Failed requests automatically retry
4. ✅ **Secure** - Proper cleanup on failure
5. ✅ **Debuggable** - Console logs for every step

---

## 🔄 Complete Flow Example

```typescript
// User is browsing, access token expires in background

// User clicks "View Jobs"
GET /api/Jobs
  → 401 Unauthorized (token expired)
  → Interceptor catches 401
  → isRefreshingToken = true
  → Call POST /auth/refresh
  → Success! New tokens received
  → authService.updateTokens() stores new tokens
  → Update original request headers
  → Retry GET /api/Jobs with new token
  → Success! Jobs list displayed
  → User never knew token expired

// If user clicked 5 buttons at once:
GET /api/Jobs → 401 → Start refresh
GET /api/Posts → 401 → Queue
GET /api/Profile → 401 → Queue
GET /api/Roadmaps → 401 → Queue
GET /api/Applications → 401 → Queue
  → One refresh completes
  → All 5 requests retry with new token
  → All succeed
```

---

## ✅ Verification Checklist

- [x] 401 errors trigger refresh
- [x] New tokens stored automatically
- [x] Failed requests retry with new token
- [x] Multiple 401s only trigger one refresh
- [x] Queue processes correctly
- [x] Expired refresh token redirects to login
- [x] Console logs show each step
- [x] No infinite loops
- [x] Clean error handling

---

**Your refresh token mechanism is now production-ready!** 🎉
