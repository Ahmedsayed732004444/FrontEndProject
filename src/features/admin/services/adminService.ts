import { apiClient } from "@/lib/api/client";
import type {
  RoleListItem,
  RoleDetails,
  CreateRoleRequest,
  UpdateRoleRequest,
  AdminUserListItem,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/admin";


// Roles API endpoints
export const adminService = {
  // Roles
  async getRoles(signal?: AbortSignal): Promise<RoleListItem[]> {
    const response = await apiClient.get<any>("/Roles", { signal });
    return response.value !== undefined ? response.value : response;
  },

  async getRoleById(id: string, signal?: AbortSignal): Promise<RoleDetails> {
    const response = await apiClient.get<any>(`/Roles/${id}`, { signal });
    return response.value !== undefined ? response.value : response;
  },

  async getPermissions(signal?: AbortSignal): Promise<string[]> {
    const response = await apiClient.get<any>("/Roles/permissions", { signal });
    return response.value !== undefined ? response.value : response;
  },

  async createRole(data: CreateRoleRequest): Promise<RoleDetails> {
    const response = await apiClient.post<RoleDetails>("/Roles", data);
    return response;
  },

  async updateRole(id: string, data: UpdateRoleRequest): Promise<void> {
    await apiClient.put(`/Roles/${id}`, data);
  },

  async toggleRoleStatus(id: string): Promise<void> {
    await apiClient.put(`/Roles/${id}/toggle-status`);
  },

  // Users
  async getUsers(signal?: AbortSignal): Promise<AdminUserListItem[]> {
    const response = await apiClient.get<any>("/Users", { signal });
    return response.value !== undefined ? response.value : response;
  },

  async getUserById(id: string): Promise<AdminUserListItem> {
    const response = await apiClient.get<any>(`/Users/${id}`);
    return response.value !== undefined ? response.value : response;
  },

  async createUser(data: CreateUserRequest): Promise<AdminUserListItem> {
    const response = await apiClient.post<AdminUserListItem>("/Users", data);
    return response;
  },

  async updateUser(id: string, data: UpdateUserRequest): Promise<void> {
    await apiClient.put(`/Users/${id}`, data);
  },

  async toggleUserStatus(id: string): Promise<void> {
    await apiClient.put(`/Users/${id}/toggle-status`);
  },

  async unlockUser(id: string): Promise<void> {
    await apiClient.put(`/Users/${id}/unlock`);
  },
};
