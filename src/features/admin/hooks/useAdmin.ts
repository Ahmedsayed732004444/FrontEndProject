import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "../services/adminService";
import { extractErrorMessage } from "@/lib/api/errors";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/features/admin/types/admin";

// Roles hooks
export const useGetRoles = () => {
  return useQuery({
    queryKey: ["admin-roles"],
    queryFn: ({ signal }) => adminService.getRoles(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetRoleById = (id: string) => {
  return useQuery({
    queryKey: ["admin-roles", id],
    queryFn: ({ signal }) => adminService.getRoleById(id, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["admin-permissions"],
    queryFn: ({ signal }) => adminService.getPermissions(signal),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => adminService.createRole(data),
    onSuccess: () => {
      toast.success("Role created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleRequest }) =>
      adminService.updateRole(id, data),
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleRoleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.toggleRoleStatus(id),
    onSuccess: () => {
      toast.success("Role status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

// Users hooks
export const useGetAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: ({ signal }) => adminService.getUsers(signal),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminService.createUser(data),
    onSuccess: () => {
      toast.success("User created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.toggleUserStatus(id),
    onSuccess: () => {
      toast.success("User status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.unlockUser(id),
    onSuccess: () => {
      toast.success("User unlocked successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};
