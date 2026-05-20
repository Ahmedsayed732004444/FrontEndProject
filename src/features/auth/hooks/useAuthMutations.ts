// src/features/auth/hooks/useAuthMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../services/authApi";
import { authService } from "../services/authService";
import { QUERY_KEYS } from "../types/auth";
import { apiClient } from "@/lib/api/client";
import { extractErrorMessage, extractValidationErrors } from "@/lib/api/errors";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      const basicUser = { id: data.id, firstName: data.firstName, lastName: data.lastName, email: data.email };
      authService.setAuthData(basicUser, data.token, data.refreshToken, data.expiresIn, data.refreshTokenExpiration);
      try {
        const fullUser = await apiClient.getMe();
        authService.updateUser(fullUser);
        queryClient.setQueryData(QUERY_KEYS.auth.user, { id: fullUser.id, firstName: fullUser.firstName, lastName: fullUser.lastName, email: fullUser.email });
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], fullUser);
        toast.success("Login successful!");
        navigate("/profile");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        queryClient.setQueryData(QUERY_KEYS.auth.user, basicUser);
        queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], basicUser);
        toast.success("Login successful!");
        navigate("/profile");
      }
    },
    onError: (error) => {
      const validationErrors = extractValidationErrors(error);
      if (Object.keys(validationErrors).length === 0) {
        const message = extractErrorMessage(error);
        toast.error(message);
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success("Registration successful! Please check your email for verification.");
      navigate("/emailConfirmation");
    },
    onError: (error) => {
      const validationErrors = extractValidationErrors(error);
      if (Object.keys(validationErrors).length === 0) {
        const message = extractErrorMessage(error);
        toast.error(message);
      }
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent! Please check your inbox.");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful! Please login with your new password.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useResendConfirmationEmail = () => {
  return useMutation({
    mutationFn: authApi.resendConfirmationEmail,
    onSuccess: () => {
      toast.success("Confirmation code sent! Please check your email.");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useConfirmEmail = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.confirmEmail,
    onSuccess: () => {
      toast.success("Email confirmed successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      authService.updateTokens(data);
      const user = { id: data.id, firstName: data.firstName, lastName: data.lastName, email: data.email };
      queryClient.setQueryData(QUERY_KEYS.auth.user, user);
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
    },
    onError: (error) => {
      authService.clearAuthData();
      queryClient.clear();
      toast.error(extractErrorMessage(error) || "Session expired. Please login again.");
    },
  });
};

export const useRevokeRefreshToken = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authApi.revokeRefreshToken,
    onSuccess: () => {
      authService.clearAuthData();
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error) || "Failed to revoke token");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return () => {
    authService.clearAuthData();
    queryClient.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };
};

export const useResendConfirmEmail = () => {
  return useMutation({
    mutationFn: authApi.resendConfirmationEmail,
    onSuccess: () => {
      toast.success("Confirmation email sent successfully!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};
