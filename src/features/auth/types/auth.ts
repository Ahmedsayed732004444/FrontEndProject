// src/features/auth/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResendConfirmationEmailRequest {
  email: string;
}

export interface ConfirmationEmailRequest {
  userId: string;
  code: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface RevokeRefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiration: string;
}

export interface RefreshTokenResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiration: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName?: string;
  isEmailConfirmed?: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
  type?: string;
  title?: string;
  traceId?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const QUERY_KEYS = {
  auth: {
    user: ["auth", "user"] as const,
    profile: ["auth", "profile"] as const,
  },
} as const;
