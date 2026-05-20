// src/test_successful_refresh.js
import axios from 'axios';

const email = 'company123@gmail.com';
const password = 'P@ssword123';
const BASE_URL = 'https://careerpathfinal.runasp.net';

const store = {};
const localStorageMock = {
  getItem(key) {
    return store[key] || null;
  },
  setItem(key, value) {
    store[key] = String(value);
  },
  removeItem(key) {
    delete store[key];
  },
  clear() {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  }
};

class AuthService {
  constructor() {
    this.refreshPromise = null;
  }

  getToken() {
    return localStorageMock.getItem("auth_token");
  }

  getRefreshToken() {
    return localStorageMock.getItem("auth_refresh_token");
  }

  isRefreshTokenExpired() {
    const expiryStr = localStorageMock.getItem("auth_refresh_token_expiry");
    if (!expiryStr) return false;
    try {
      const expiry = new Date(expiryStr).getTime();
      if (isNaN(expiry)) return false;
      return expiry <= Date.now();
    } catch {
      return false;
    }
  }

  setAuthData(user, token, refreshToken, expiresIn, refreshTokenExpiration) {
    localStorageMock.setItem("auth_token", token);
    localStorageMock.setItem("auth_refresh_token", refreshToken);
    localStorageMock.setItem("auth_user", JSON.stringify(user));
    localStorageMock.setItem("auth_expires_in", expiresIn.toString());
    localStorageMock.setItem("auth_token_issued_at", Date.now().toString());
    if (refreshTokenExpiration) {
      localStorageMock.setItem("auth_refresh_token_expiry", refreshTokenExpiration);
    }
  }

  clearAuthData() {
    localStorageMock.removeItem("auth_token");
    localStorageMock.removeItem("auth_refresh_token");
    localStorageMock.removeItem("auth_user");
    localStorageMock.removeItem("auth_expires_in");
    localStorageMock.removeItem("auth_refresh_token_expiry");
    localStorageMock.removeItem("auth_token_issued_at");
  }

  updateTokens(response) {
    const user = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
    };
    this.setAuthData(user, response.token, response.refreshToken, response.expiresIn, response.refreshTokenExpiration);
  }

  async refreshToken() {
    if (this.refreshPromise) return this.refreshPromise;
    const token = this.getRealToken(); // Use real token for refresh request!
    const refreshToken = this.getRefreshToken();
    if (!token || !refreshToken) {
      throw new Error("No tokens available for refresh");
    }
    
    const authClient = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });

    this.refreshPromise = authClient
      .post("/auth/refresh", { token, refreshToken })
      .then((response) => {
        this.updateTokens(response.data);
        return response.data;
      })
      .finally(() => {
        this.refreshPromise = null;
      });
    return this.refreshPromise;
  }
}

const authService = new AuthService();

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: `${BASE_URL}/api`,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });
    this.failedQueue = [];
    this.isRefreshingToken = false;
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const token = authService.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[REQUEST] URL: ${config.url}, Authorization: ${config.headers.Authorization ? config.headers.Authorization.substring(0, 30) : 'none'}...`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`[RESPONSE] Status: ${response.status} for ${response.config.url}`);
        return response;
      },
      async (error) => {
        console.log(`[RESPONSE ERROR] Status: ${error.response?.status || 'no status'} for ${error.config?.url}`);
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log("❌ [INTERCEPTOR] 401 Unauthorized error received");
          console.log("❌ [INTERCEPTOR] Request URL:", originalRequest.url);

          if (this.isRefreshingToken) {
            console.log("🔄 [INTERCEPTOR] Token refresh in progress, queuing request...");
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshingToken = true;

          const currentRefreshToken = authService.getRefreshToken();
          if (!currentRefreshToken || authService.isRefreshTokenExpired()) {
            authService.clearAuthData();
            this.isRefreshingToken = false;
            this.processQueue(new Error("No valid refresh token"), null);
            return Promise.reject(error);
          }

          try {
            console.log("🔄 [INTERCEPTOR] Refreshing token...");
            const refreshResponse = await authService.refreshToken();

            console.log("✅ [INTERCEPTOR] Token refreshed successfully");
            const newToken = refreshResponse.token;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            this.processQueue(null, newToken);
            this.isRefreshingToken = false;

            console.log("🔁 [INTERCEPTOR] Retrying original request with new token");
            return this.client(originalRequest);

          } catch (refreshError) {
            console.error("❌ [INTERCEPTOR] Token refresh failed:", refreshError.response?.data || refreshError.message);
            authService.clearAuthData();
            this.isRefreshingToken = false;
            this.processQueue(refreshError, null);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  processQueue(error, token) {
    console.log(`📋 [INTERCEPTOR] Processing ${this.failedQueue.length} queued requests...`);
    this.failedQueue.forEach((queuedRequest) => {
      if (error) {
        queuedRequest.reject(error);
      } else if (token) {
        if (queuedRequest.config.headers) {
          queuedRequest.config.headers.Authorization = `Bearer ${token}`;
        }
        this.client(queuedRequest.config)
          .then((response) => queuedRequest.resolve(response))
          .catch((err) => queuedRequest.reject(err));
      }
    });
    this.failedQueue = [];
  }

  getMe() {
    return this.client.get("/UserProfile").then(res => res.data);
  }
}

const apiClient = new ApiClient();

async function runTest() {
  console.log('--- Step 1: Login ---');
  let originalToken;
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth`, { email, password });
    originalToken = loginRes.data.token;
    authService.setAuthData(
      { id: loginRes.data.id, firstName: loginRes.data.firstName, lastName: loginRes.data.lastName, email: loginRes.data.email },
      originalToken,
      loginRes.data.refreshToken,
      loginRes.data.expiresIn,
      loginRes.data.refreshTokenExpiration
    );
    console.log('✅ Logged in successfully!');
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    return;
  }

  // Setup getToken mock to return corrupted token on first call to force 401
  let returnCorruptedToken = true;
  authService.getRealToken = () => localStorageMock.getItem("auth_token");
  authService.getToken = () => {
    const realToken = localStorageMock.getItem("auth_token");
    if (returnCorruptedToken) {
      returnCorruptedToken = false;
      console.log('🔧 [MOCK] authService.getToken() returning corrupted token once...');
      return realToken + 'invalidSignature';
    }
    return realToken;
  };

  console.log('\n--- Step 2: Call getMe (it should trigger 401, refresh token, and succeed) ---');
  try {
    const profile = await apiClient.getMe();
    console.log('✅ getMe call succeeded! Profile returned:', profile.firstName, profile.lastName);
    
    const newToken = authService.getRealToken();
    console.log('Original Token:', originalToken.substring(0, 15) + '...');
    console.log('New Token:     ', newToken.substring(0, 15) + '...');
    console.log('Tokens are different:', originalToken !== newToken);
  } catch (err) {
    console.error('❌ getMe call failed:', err.message);
  }
}

runTest();
