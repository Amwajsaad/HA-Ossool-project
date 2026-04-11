import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters."),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters."),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),
    remember: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });