// src/features/auth/services/authApi.ts
import axios from "axios";
import { env } from "@/lib/env";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgetPasswordRequest,
  ResetPasswordRequest,
  ResendConfirmationEmailRequest,
  ConfirmationEmailRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RevokeRefreshTokenRequest,
} from "../types/auth";

const authClient = axios.create({
  baseURL: env.AUTH_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authClient.post<LoginResponse>("/auth", data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<void> => {
    await authClient.post("/auth/register", data);
  },
  forgotPassword: async (data: ForgetPasswordRequest): Promise<void> => {
    await authClient.post("/auth/forget-password", data);
  },
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await authClient.post("/auth/reset-password", data);
  },
  resendConfirmationEmail: async (data: ResendConfirmationEmailRequest): Promise<void> => {
    await authClient.post("/auth/resend-confirmation-email", data);
  },
  confirmEmail: async (data: ConfirmationEmailRequest): Promise<void> => {
    await authClient.post("/auth/confirm-email", data);
  },
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await authClient.post<RefreshTokenResponse>("/Auth/refresh", data);
    return response.data;
  },
  revokeRefreshToken: async (data: RevokeRefreshTokenRequest): Promise<void> => {
    await authClient.post("/auth/revoke-refresh-token", data);
  },
};
