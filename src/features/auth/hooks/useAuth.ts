// src/features/auth/hooks/useAuth.ts
import { useAuthContext } from "../context/AuthContext";
import { useLogin, useRegister, useForgotPassword, useResetPassword, useResendConfirmationEmail, useConfirmEmail, useLogout, useRevokeRefreshToken } from "./useAuthMutations";
import type { LoginRequest } from "../types/auth";

export const useAuth = () => {
  const authContext = useAuthContext();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const resendConfirmationMutation = useResendConfirmationEmail();
  const confirmEmailMutation = useConfirmEmail();
  const logoutFn = useLogout();
  const revokeRefreshTokenMutation = useRevokeRefreshToken();

  const login = (data: LoginRequest, options?: { onError?: (error: unknown) => void }) => {
    loginMutation.mutate(data, {
      onSuccess: async (response) => {
        authContext.login({ id: response.id, firstName: response.firstName, lastName: response.lastName, email: response.email }, response.token, response.refreshToken, response.expiresIn, response.refreshTokenExpiration);
      },
      onError: options?.onError,
    });
  };

  return {
    user: authContext.user,
    token: authContext.token,
    isAuthenticated: authContext.isAuthenticated,
    isLoading: authContext.isLoading,
    login,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    resendConfirmationCode: resendConfirmationMutation.mutate,
    confirmEmail: confirmEmailMutation.mutate,
    logout: logoutFn,
    revokeRefreshToken: revokeRefreshTokenMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isResendConfirmationLoading: resendConfirmationMutation.isPending,
    isConfirmEmailLoading: confirmEmailMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    resendConfirmationError: resendConfirmationMutation.error,
    confirmEmailError: confirmEmailMutation.error,
  };
};
