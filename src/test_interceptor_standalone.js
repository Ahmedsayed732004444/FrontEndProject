// src/test_interceptor_standalone.js
import axios from 'axios';

const email = 'company123@gmail.com';
const password = 'P@ssword123';
const BASE_URL = 'https://careerpathfinal.runasp.net';

// Mock localStorage
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

// AuthService Mock/Implementation
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
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    if (!token || !refreshToken) {
      throw new Error("No tokens available for refresh");
    }
    if (this.isRefreshTokenExpired()) {
      this.clearAuthData();
      throw new Error("Refresh token expired");
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

// ApiClient Implementation (Exact match of client.ts response interceptor)
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
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log("❌ [LOG] 401 Unauthorized error received");
          console.log("❌ [LOG] Request URL:", originalRequest.url);
          console.log("❌ [LOG] Error response:", error.response?.data);

          if (this.isRefreshingToken) {
            console.log("🔄 [LOG] Token refresh in progress, queuing request...");
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
          console.log("🔍 [LOG] Current refresh token exists:", !!currentRefreshToken);
          console.log("🔍 [LOG] Refresh token expired:", authService.isRefreshTokenExpired());

          if (!currentRefreshToken || authService.isRefreshTokenExpired()) {
            console.log("❌ [LOG] No valid refresh token available");
            authService.clearAuthData();
            this.isRefreshingToken = false;
            this.processQueue(new Error("No valid refresh token"), null);
            return Promise.reject(error);
          }

          try {
            console.log("🔄 [LOG] Refreshing token...");
            console.log("🔍 [LOG] Current token:", authService.getToken()?.substring(0, 20) + "...");
            console.log("🔍 [LOG] Current refresh token:", authService.getRefreshToken()?.substring(0, 20) + "...");

            const refreshResponse = await authService.refreshToken();

            console.log("✅ [LOG] Token refreshed successfully");
            console.log("🔍 [LOG] New token:", refreshResponse.token.substring(0, 20) + "...");
            console.log("🔍 [LOG] New refresh token:", refreshResponse.refreshToken.substring(0, 20) + "...");

            const newToken = refreshResponse.token;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            this.processQueue(null, newToken);
            this.isRefreshingToken = false;

            console.log("🔁 [LOG] Retrying original request with new token");
            return this.client(originalRequest);

          } catch (refreshError) {
            console.error("❌ [LOG] Token refresh failed:", refreshError.response?.data || refreshError.message);
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
    console.log(`📋 [LOG] Processing ${this.failedQueue.length} queued requests...`);
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
  try {
    const loginRes = await axios.post(`${BASE_URL}/auth`, { email, password });
    authService.setAuthData(
      { id: loginRes.data.id, firstName: loginRes.data.firstName, lastName: loginRes.data.lastName, email: loginRes.data.email },
      loginRes.data.token,
      loginRes.data.refreshToken,
      loginRes.data.expiresIn,
      loginRes.data.refreshTokenExpiration
    );
    console.log('✅ Logged in successfully!');
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    return;
  }

  console.log('\n--- Step 2: Make successful call using valid token ---');
  try {
    const profile = await apiClient.getMe();
    console.log('✅ Profile loaded successfully. First Name:', profile.firstName);
  } catch (err) {
    console.error('❌ Profile load failed:', err.message);
    return;
  }

  console.log('\n--- Step 3: Corrupt token in localStorage to simulate expiry & call getMe ---');
  // We change the signature of the token to force a 401
  const validToken = authService.getToken();
  const corruptedToken = validToken.substring(0, validToken.lastIndexOf('.')) + '.invalidSignature';
  localStorageMock.setItem('auth_token', corruptedToken);

  try {
    console.log('Making API call with corrupted token...');
    const profileAfterRefresh = await apiClient.getMe();
    console.log('✅ Profile loaded after auto-refresh successfully! First Name:', profileAfterRefresh.firstName);
  } catch (err) {
    console.error('❌ Call failed after refresh attempt:', err.response?.data || err.message);
  }
}

runTest();
