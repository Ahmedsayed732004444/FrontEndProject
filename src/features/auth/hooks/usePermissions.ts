// src/features/auth/hooks/usePermissions.ts
import { useMemo } from "react";
import { getUserRoles, getUserPermissions, getUserId } from "@/lib/jwt";
import { useAuth } from "./useAuth";

export const usePermissions = () => {
  const { token } = useAuth();
  const roles = useMemo(() => getUserRoles(), [token]);
  const permissions = useMemo(() => getUserPermissions(), [token]);
  const userId = useMemo(() => getUserId(), [token]);

  return {
    roles,
    permissions,
    userId,
    isCompany: roles.some((r) => r.toLowerCase() === "company"),
    isAdmin: roles.some((r) => r.toLowerCase() === "admin"),
    isMember: roles.some((r) => r.toLowerCase() === "member"),
    hasPermission: (permission: string) => permissions.includes(permission),
    hasRole: (role: string) => roles.some((r) => r.toLowerCase() === role.toLowerCase()),
    companyId: userId,
  };
};
