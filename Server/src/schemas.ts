import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email format"),
  role: z.enum(["Super Admin", "Manager", "Viewer"]).default("Manager"),
});

export const userQuerySchema = z.object({
  role: z.string().optional(),
  status: z.string().optional(),
  kycStatus: z.string().optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID format").or(z.string().min(1)), // Accepting any non-empty string since dummy IDs might not be strict UUIDs
});

export const updateUserSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  role: z.enum(["Super Admin", "Manager", "Viewer"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
  kycStatus: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const jobQuerySchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
});

export const jobIdParamSchema = z.object({
  id: z.string().min(1),
});
