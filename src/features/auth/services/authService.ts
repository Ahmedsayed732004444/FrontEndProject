// src/features/auth/services/authService.ts
import type { RefreshTokenResponse, User } from "../types/auth";
import { authApi } from "./authApi";

class AuthService {
  private refreshPromise: Promise<RefreshTokenResponse> | null = null;
  private readonly TOKEN_KEY = "auth_token";
  private readonly REFRESH_TOKEN_KEY = "auth_refresh_token";
  private readonly USER_KEY = "auth_user";
  private readonly EXPIRES_IN_KEY = "auth_expires_in";
  private readonly REFRESH_TOKEN_EXPIRY_KEY = "auth_refresh_token_expiry";
  private readonly TOKEN_ISSUED_AT_KEY = "auth_token_issued_at";
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter((l) => l !== listener); };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  isRefreshing(): boolean {
    return this.refreshPromise !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  getTokenExpiry(): number | null {
    const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
    if (!expiresIn) return null;
    const expiresInSeconds = parseInt(expiresIn, 10);
    if (isNaN(expiresInSeconds)) return null;
    const issuedAt = localStorage.getItem(this.TOKEN_ISSUED_AT_KEY);
    if (issuedAt) {
      return parseInt(issuedAt, 10) + expiresInSeconds * 1000;
    }
    return null;
  }

  isTokenExpiredOrExpiringSoon(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return expiry <= fiveMinutesFromNow;
  }

  isRefreshTokenExpired(): boolean {
    const expiryStr = localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);
    if (!expiryStr) return false;
    try {
      const expiry = new Date(expiryStr).getTime();
      if (isNaN(expiry)) return false;
      return expiry <= Date.now();
    } catch {
      return false;
    }
  }

  setAuthData(user: User, token: string, refreshToken: string, expiresIn: number, refreshTokenExpiration?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.EXPIRES_IN_KEY, expiresIn.toString());
    localStorage.setItem(this.TOKEN_ISSUED_AT_KEY, Date.now().toString());
    if (refreshTokenExpiration) {
      localStorage.setItem(this.REFRESH_TOKEN_EXPIRY_KEY, refreshTokenExpiration);
    } else if (!localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY)) {
      const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      localStorage.setItem(this.REFRESH_TOKEN_EXPIRY_KEY, thirtyDays.toISOString());
    }
    this.notifyListeners();
  }

  clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRES_IN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.TOKEN_ISSUED_AT_KEY);
    this.notifyListeners();
  }

  updateTokens(response: RefreshTokenResponse): void {
    const user: User = {
      id: response.id,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
    };
    this.setAuthData(user, response.token, response.refreshToken, response.expiresIn, response.refreshTokenExpiration);
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
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
    this.refreshPromise = authApi
      .refreshToken({ token, refreshToken })
      .then((response) => {
        this.updateTokens(response);
        return response;
      })
      .finally(() => {
        this.refreshPromise = null;
      });
    return this.refreshPromise;
  }

  async ensureValidToken(): Promise<string | null> {
    if (!this.getToken()) return null;

    // If token will expire in 5 minutes, refresh it now
    if (this.isTokenExpiredOrExpiringSoon()) {
      try {
        const res = await this.refreshToken();
        return res.token;
      } catch {
        return null;
      }
    }
    return this.getToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    if (!token || !refreshToken) return false;
    if (this.isRefreshTokenExpired()) return false;
    return true;
  }

  getExpiresIn(): number {
    const expiresIn = localStorage.getItem(this.EXPIRES_IN_KEY);
    if (!expiresIn) return 0;
    return parseInt(expiresIn, 10) || 0;
  }

  getRefreshTokenExpiryDate(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_KEY);
  }

  updateUser(user: User): void {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    const expiresIn = this.getExpiresIn();
    const refreshTokenExpiration = this.getRefreshTokenExpiryDate();
    if (token && refreshToken) {
      this.setAuthData(user, token, refreshToken, expiresIn, refreshTokenExpiration || undefined);
    }
  }
}

export const authService = new AuthService();
