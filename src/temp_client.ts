// src/lib/api/client.ts
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/env";
import { authService } from "@/features/auth/services/authService";
import type { User } from "@/features/auth/types/auth";

const API_BASE_URL = env.API_BASE_URL;

function isAuthApiPath(url: string | undefined): boolean {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.includes("/auth/") || u.endsWith("/auth");
}

class ApiClient {
  private client: AxiosInstance;
  private failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        if (isAuthApiPath(config.url)) return config;
        const token = authService.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (isAuthApiPath(originalRequest?.url)) {
          return this.handleError(error);
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (authService.isRefreshing()) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              const token = authService.getToken();
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              originalRequest._retry = true;
              return this.client(originalRequest);
            }).catch((err) => Promise.reject(err));
          }
          originalRequest._retry = true;
          const refreshToken = authService.getRefreshToken();
          if (!refreshToken || authService.isRefreshTokenExpired()) {
            authService.clearAuthData();
            this.processQueue(null, new Error("Refresh token expired"));
            return this.handleError(error);
          }
          try {
            const response = await authService.refreshToken();
            const token = response.token;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            this.processQueue(token);
            return this.client(originalRequest);
          } catch (refreshError) {
            authService.clearAuthData();
            this.processQueue(null, refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
            return this.handleError(error);
          }
        }
        return this.handleError(error);
      }
    );
  }

  private processQueue(token: string | null, error?: Error) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private handleError(error: AxiosError) {
    return Promise.reject(error);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  public async getMe(): Promise<User> {
    return this.get<User>("/UserProfile");
  }
}

export const apiClient = new ApiClient();
