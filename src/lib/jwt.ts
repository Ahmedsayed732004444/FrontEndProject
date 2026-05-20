// src/lib/jwt.ts
import { authService } from "@/features/auth/services/authService";

export interface JwtPayload {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  jti: string;
  roles: string[];
  permissions: string[];
  exp: number;
  iss: string;
  aud: string;
  [key: string]: unknown; // Allow additional properties
}

export const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload) as JwtPayload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const getUserRoles = (): string[] => {
  const token = authService.getToken();
  if (!token) return [];
  const decoded = decodeJwt(token);
  if (!decoded) return [];
  const roles =
    decoded.roles ||
    decoded.role ||
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
    [];
  return Array.isArray(roles) ? (roles as string[]) : [roles as string];
};

export const getUserPermissions = (): string[] => {
  const token = authService.getToken();
  if (!token) return [];
  const decoded = decodeJwt(token);
  if (!decoded) return [];
  const permissions = decoded.permissions || [];
  return Array.isArray(permissions) ? (permissions as string[]) : [permissions as string];
};

export const hasRole = (role: string): boolean => getUserRoles().includes(role);
export const hasPermission = (permission: string): boolean => getUserPermissions().includes(permission);
export const getUserId = (): string | null => {
  const token = authService.getToken();
  if (!token) return null;
  const decoded = decodeJwt(token);
  return decoded?.sub || null;
};

export const getTokenAccountHints = (): { firstName: string; lastName: string; email: string } | null => {
  const token = authService.getToken();
  if (!token) return null;
  const d = decodeJwt(token);
  if (!d) return null;
  const email = (d.email as string) || (d.unique_name as string) || (d.preferred_username as string) || "";
  const firstName = (d.given_name as string) || "";
  const lastName = (d.family_name as string) || "";
  if (!email && !firstName && !lastName) return null;
  return { firstName: firstName || "Account", lastName, email: email || "" };
};

export const isCompany = (): boolean => hasRole("Company");
export const isAdmin = (): boolean => hasRole("Admin");
export const isMember = (): boolean => hasRole("Member");
