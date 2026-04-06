import { z } from "zod";

export const locationsSchema = z.object({
  name: z
    .string()
    .min(2, "Location name must be at least 2 characters")
    .trim(),

  city: z
    .string()
    .min(1, "City is required")
    .trim(),

  assets: z
    .string()
    .min(1, "Assets count is required")
    .refine((value) => Number(value) >= 0, {
      message: "Assets count must be 0 or more.",
    }),

  departments: z
    .string()
    .min(1, "Departments count is required")
    .refine((value) => Number(value) >= 0, {
      message: "Departments count must be 0 or more.",
    }),

  status: z.enum(["Active", "Inactive"]),
});