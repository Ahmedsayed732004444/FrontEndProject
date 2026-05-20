import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z.string()
    .min(8, "Password should be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one non-alphanumeric character"),
  firstName: z.string().min(3, "First name must be at least 3 characters").max(100, "First name must be at most 100 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters").max(100, "Last name must be at most 100 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  code: z.string().min(1, "Verification code is required"),
  newPassword: z.string()
    .min(8, "Password should be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one non-alphanumeric character"),
});

export const confirmEmailSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  code: z.string().min(1, "Verification code is required"),
});

export const resendConfirmationEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
});
