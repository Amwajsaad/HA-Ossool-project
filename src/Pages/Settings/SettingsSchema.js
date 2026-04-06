import { z } from "zod";

export const settingsSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters.")
    .trim(),

  supportEmail: z
    .string()
    .min(1, "Support email is required.")
    .email("Enter a valid email address."),

  theme: z.enum(["Light", "Dark"]),

  language: z.enum(["English", "Arabic"]),

  notifications: z.boolean(),
});