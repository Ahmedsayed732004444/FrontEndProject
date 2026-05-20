// src/features/auth/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/auth";
import { QUERY_KEYS } from "../types/auth";
import { authService } from "../services/authService";
import { apiClient } from "@/lib/api/client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, refreshToken: string, expiresIn: number, refreshTokenExpiryDate?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [, setTick] = React.useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const unsubscribe = authService.subscribe(() => {
      forceUpdate();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.auth.user, "me"] });
    });
    return () => unsubscribe();
  }, [queryClient, forceUpdate]);

  const logout = useCallback(() => {
    authService.clearAuthData();
    queryClient.clear();
    forceUpdate();
  }, [queryClient, forceUpdate]);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: [QUERY_KEYS.auth.user, "me"],
    queryFn: async () => {
      if (!authService.isAuthenticated()) return null;
      try {
        const userData = await apiClient.getMe();
        authService.updateUser(userData);
        return userData;
      } catch (error: any) {
        console.error("Auth validation failed:", error);
        // Only logout if refresh token is actually expired
        const status = error?.response?.status;
        if (status === 401 && authService.isRefreshTokenExpired()) {
          logout();
        }
        // For any other error, return the cached user to prevent logout
        return authService.getUser();
      }
    },
    enabled: authService.isAuthenticated(),
    initialData: () => authService.getUser() ?? undefined,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (user) {
      queryClient.setQueryData(QUERY_KEYS.auth.user, { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
      queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
    }
  }, [user, queryClient]);

  const login = useCallback((user: User, token: string, refreshTokenValue: string, expiresIn: number, refreshTokenExpiryDate?: string) => {
    authService.setAuthData(user, token, refreshTokenValue, expiresIn, refreshTokenExpiryDate);
    queryClient.setQueryData(QUERY_KEYS.auth.user, { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    queryClient.setQueryData([QUERY_KEYS.auth.user, "me"], user);
  }, [queryClient]);

  const token = authService.getToken();
  const refreshToken = authService.getRefreshToken();
  const hasSession = authService.isAuthenticated();
  const storedUser = authService.getUser();
  const resolvedUser = user ?? storedUser;
  const isAuthenticated = !!(token && refreshToken && hasSession && resolvedUser);

  const value: AuthContextType = {
    user: resolvedUser,
    token,
    refreshToken,
    isAuthenticated,
    isLoading: hasSession && isLoadingUser && !resolvedUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
