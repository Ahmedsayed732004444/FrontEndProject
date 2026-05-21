// src/lib/api/client.ts
import axios, { 
  AxiosError, 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse, 
  type InternalAxiosRequestConfig 
} from "axios";
import { env } from "@/lib/env";
import { authService } from "@/features/auth/services/authService";
import type { User } from "@/features/auth/types/auth";

const API_BASE_URL = env.API_BASE_URL;

function isAuthApiPath(url: string | undefined): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes("/auth/") || u.endsWith("/auth");
}

interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  config: InternalAxiosRequestConfig;
}

class ApiClient {
  private client: AxiosInstance;
  private failedQueue: QueuedRequest[] = [];
  private isRefreshingToken = false;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // ══════════════════════════════════════════════════════════
    // REQUEST INTERCEPTOR: Add token to every request
    // ══════════════════════════════════════════════════════════
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip auth header for /auth routes
        if (isAuthApiPath(config.url)) {
          return config;
        }

        // ✅ بعت التوكن الموجود بس — مش ensureValidToken
        const token = authService.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // ══════════════════════════════════════════════════════════
    // RESPONSE INTERCEPTOR: Handle 401 errors and refresh token
    // ══════════════════════════════════════════════════════════
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Don't retry auth endpoints
        if (isAuthApiPath(originalRequest?.url)) {
          return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          console.error("❌ 401 Unauthorized error received");
          console.error("Request URL:", originalRequest.url);
          console.error("Error response:", error.response?.data);

          // ─────────────────────────────────────────────────────
          // SCENARIO 1: Already refreshing - queue this request
          // ─────────────────────────────────────────────────────
          if (this.isRefreshingToken) {
            console.log("🔄 Token refresh in progress, queuing request...");

            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          // ─────────────────────────────────────────────────────
          // SCENARIO 2: First 401 - start refresh process
          // ─────────────────────────────────────────────────────
          originalRequest._retry = true;
          this.isRefreshingToken = true;

          // ✅ تأكد إن authService مش بيعمل refresh بالفعل
          if (authService.isRefreshing()) {
            return authService.refreshToken()
              .then((res) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${res.token}`;
                }
                return this.client(originalRequest);
              })
              .catch(() => {
                authService.clearAuthData();
                return Promise.reject(error);
              })
              .finally(() => {
                this.isRefreshingToken = false;
              });
          }

          const currentRefreshToken = authService.getRefreshToken();
          console.log("Current refresh token exists:", !!currentRefreshToken);
          console.log("Refresh token expired:", authService.isRefreshTokenExpired());

          // No refresh token or expired
          if (!currentRefreshToken || authService.isRefreshTokenExpired()) {
            console.error("❌ No valid refresh token available");
            authService.clearAuthData();
            this.isRefreshingToken = false;
            this.processQueue(new Error("No valid refresh token"), null);
            // Don't redirect here - let AuthContext handle it
            return Promise.reject(error);
          }

          try {
            console.log("🔄 Refreshing token...");
            console.log("Current token:", authService.getToken()?.substring(0, 20) + "...");
            console.log("Current refresh token:", authService.getRefreshToken()?.substring(0, 20) + "...");

            // Call refresh endpoint
            const refreshResponse = await authService.refreshToken();

            console.log("✅ Token refreshed successfully");
            console.log("New token:", refreshResponse.token.substring(0, 20) + "...");
            console.log("New refresh token:", refreshResponse.refreshToken.substring(0, 20) + "...");

            // Store new tokens (already done in authService.refreshToken via updateTokens)
            const newToken = refreshResponse.token;

            // Update the failed request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // Process all queued requests with new token
            this.processQueue(null, newToken);

            // Reset refresh flag
            this.isRefreshingToken = false;

            // Retry the original request with new token
            console.log("🔁 Retrying original request with new token");
            return this.client(originalRequest);

          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);

            // Clear auth data on refresh failure
            authService.clearAuthData();
            this.isRefreshingToken = false;

            // Reject all queued requests
            this.processQueue(
              refreshError instanceof Error
                ? refreshError
                : new Error("Token refresh failed"),
              null
            );

            // Don't redirect here - let AuthContext handle it
            return Promise.reject(refreshError);
          }
        }

        // Other errors - pass through
        return Promise.reject(error);
      }
    );
  }

  /**
   * Process all queued requests after token refresh
   * @param error - Error if refresh failed
   * @param token - New token if refresh succeeded
   */
  private processQueue(error: Error | null, token: string | null) {
    console.log(`📋 Processing ${this.failedQueue.length} queued requests...`);

    this.failedQueue.forEach((queuedRequest) => {
      if (error) {
        // Reject all queued requests if refresh failed
        queuedRequest.reject(error);
      } else if (token) {
        // Update queued request with new token and retry
        if (queuedRequest.config.headers) {
          queuedRequest.config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Retry the request
        this.client(queuedRequest.config)
          .then((response) => queuedRequest.resolve(response))
          .catch((err) => queuedRequest.reject(err));
      }
    });

    // Clear the queue
    this.failedQueue = [];
  }

  // ══════════════════════════════════════════════════════════
  // PUBLIC API METHODS
  // ══════════════════════════════════════════════════════════

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  public async getMe(): Promise<User> {
    return this.get<User>("/UserProfile");
  }

  /**
   * Get the raw axios instance for advanced use cases
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
