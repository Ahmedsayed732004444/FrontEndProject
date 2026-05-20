import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").max(50, "Role name must be at most 50 characters"),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").max(50, "Role name must be at most 50 characters"),
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

export const createUserSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters").max(100, "First name must be at most 100 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters").max(100, "Last name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters").max(100, "First name must be at most 100 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters").max(100, "Last name must be at most 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
    .optional(),
  roles: z.array(z.string()).min(1, "At least one role is required"),
});

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
